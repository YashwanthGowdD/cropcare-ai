import { describe, it, expect, beforeEach, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';

describe('Part 3: Crop Disease Model Integration & Safe Assessment', () => {
  const originalEnv = { ...process.env };
  const validPngBuffer = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
    0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4,
    0x89, 0x00, 0x00, 0x00, 0x0a, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
    0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00,
    0x00, 0x00, 0x00, 0x49, 0x45, 0x4e, 0x44, 0xae,
    0x42, 0x60, 0x82
  ]);

  beforeEach(() => {
    // Reset env vars before each test
    delete process.env.AI_PROVIDER;
    delete process.env.MOCK_AI_MODE;
    delete process.env.GEMINI_API_KEY;
    delete process.env.VISION_MODEL_ENDPOINT;
    delete process.env.VISION_API_KEY;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('1. Successfully analyzes scan with real/mock vision provider and verified treatment match', async () => {
    process.env.AI_PROVIDER = 'mock_ai';
    process.env.MOCK_AI_MODE = 'success';

    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'farmer-ai-success')
      .field('crop', 'Tomato')
      .field('duration', '3-5 days')
      .field('affectedArea', 'Localized (< 20%)')
      .field('weather', 'Warm and humid (26-30°C)')
      .field('symptoms', JSON.stringify(['Concentric brown rings on lower leaves', 'Yellow halo surrounding lesions']))
      .attach('image', validPngBuffer, { filename: 'tomato_early_blight.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    expect(res.body.scan).toBeDefined();

    const { scan } = res.body;
    expect(scan.analysisStatus).toBe('ai_assisted');
    expect(scan.isDemo).toBe(false);
    expect(scan.providerName).toBe('mock_ai');
    expect(scan.modelName).toBe('mock-agro-vision-v2');
    expect(scan.confidence).toBe(88.5);
    expect(scan.isLowConfidence).toBe(false);
    expect(scan.isUnsupportedCrop).toBe(false);
    expect(scan.demoNotice).toBeNull();

    // Verify treatment is grounded against verified database
    expect(scan.treatmentRecommendations.length).toBeGreaterThan(0);
    expect(scan.recommendedMedicines.length).toBeGreaterThan(0);
    expect(scan.recommendedMedicines).toContain('med-001');

    // Verify recommended medicine exists in verified product catalog with safety/label directions
    const productsRes = await request(app).get('/api/products');
    expect(productsRes.status).toBe(200);
    const matchedProduct = productsRes.body.products.find(p => p.id === scan.recommendedMedicines[0]);
    expect(matchedProduct).toBeDefined();
    expect(matchedProduct).toHaveProperty('id');
    expect(matchedProduct).toHaveProperty('name');
    expect(matchedProduct).toHaveProperty('price');
    expect(matchedProduct).toHaveProperty('dosage');
    expect(matchedProduct).toHaveProperty('precautions');
    expect(matchedProduct.precautions).toBeTruthy();
  });

  it('2. Defaults safely to demo mode when no provider is configured, with null confidence', async () => {
    // AI_PROVIDER is unset or set to 'demo'
    process.env.AI_PROVIDER = 'demo';

    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'farmer-demo-test')
      .field('crop', 'Rice / Paddy')
      .field('duration', '1-2 weeks')
      .field('affectedArea', 'Moderate (20% - 50%)')
      .field('weather', 'Continuous rain / high humidity')
      .field('symptoms', JSON.stringify(['Spindle-shaped lesions on leaves']))
      .attach('image', validPngBuffer, { filename: 'paddy_leaf.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    const { scan } = res.body;

    expect(scan.analysisStatus).toBe('demo');
    expect(scan.isDemo).toBe(true);
    expect(scan.confidence).toBeUndefined(); // Never fabricate confidence scores in demo mode
    expect(scan.diseaseName).toMatch(/Demo Assessment/i);
    expect(scan.demoNotice).toMatch(/Demo assessment only/i);
  });

  it('3. Withholds chemical medicine recommendations on low-confidence detection', async () => {
    process.env.AI_PROVIDER = 'mock_ai';
    process.env.MOCK_AI_MODE = 'low_confidence';

    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'farmer-low-conf')
      .field('crop', 'Tomato')
      .field('duration', '1-2 days')
      .field('affectedArea', 'Isolated (< 5%)')
      .field('weather', 'Dry')
      .field('symptoms', JSON.stringify(['Unclear slight yellowing']))
      .attach('image', validPngBuffer, { filename: 'vague_leaf.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    const { scan } = res.body;

    expect(scan.analysisStatus).toBe('ai_assisted');
    expect(scan.isLowConfidence).toBe(true);
    expect(scan.confidence).toBe(42.5);
    // Grounding check: Chemical medicines must be withheld
    expect(scan.recommendedMedicines).toEqual([]);
    expect(scan.treatmentRecommendations.some(r => r.includes('withheld') || r.includes('ambiguous') || r.includes('agronomist'))).toBe(true);
    expect(scan.treatmentTaken).toMatch(/Chemical recommendations withheld: low confidence/i);
  });

  it('4. Handles unsupported crop without inventing diagnosis or chemical advice', async () => {
    process.env.AI_PROVIDER = 'mock_ai';
    process.env.MOCK_AI_MODE = 'unsupported_crop';

    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'farmer-unsupported-crop')
      .field('crop', 'Exotic Dragonfruit')
      .field('duration', '3-5 days')
      .field('affectedArea', 'Localized (< 20%)')
      .field('weather', 'Tropical')
      .field('symptoms', JSON.stringify(['Strange discoloration']))
      .attach('image', validPngBuffer, { filename: 'dragonfruit.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    const { scan } = res.body;

    expect(scan.isUnsupportedCrop).toBe(true);
    expect(scan.recommendedMedicines).toEqual([]);
    expect(scan.treatmentTaken).toMatch(/Chemical recommendations withheld: unsupported crop/i);
    expect(scan.treatmentRecommendations.some(r => r.includes('pathologist') || r.includes('extension officer') || r.includes('withheld'))).toBe(true);
  });

  it('5. Handles provider timeout cleanly without crashing and records unavailable status', async () => {
    process.env.AI_PROVIDER = 'mock_ai';
    process.env.MOCK_AI_MODE = 'timeout';

    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'farmer-timeout-test')
      .field('crop', 'Wheat')
      .field('duration', '1 week')
      .field('affectedArea', 'Localized (< 20%)')
      .field('weather', 'Cold and damp')
      .field('symptoms', JSON.stringify(['Yellow stripes along leaf veins']))
      .attach('image', validPngBuffer, { filename: 'wheat_leaf.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    const { scan } = res.body;

    expect(scan.analysisStatus).toBe('unavailable');
    expect(scan.diseaseName).toBe('Diagnosis Unavailable');
    expect(scan.confidence).toBeUndefined(); // Never fabricate confidence on failure
    expect(scan.recommendedMedicines).toEqual([]);
    expect(scan.demoNotice).toMatch(/Diagnosis unavailable/i);
  });

  it('6. Handles malformed provider responses gracefully without fabricating results', async () => {
    process.env.AI_PROVIDER = 'mock_ai';
    process.env.MOCK_AI_MODE = 'malformed';

    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'farmer-malformed-test')
      .field('crop', 'Cotton')
      .field('duration', '3-5 days')
      .field('affectedArea', 'Moderate')
      .field('weather', 'Dry hot')
      .field('symptoms', JSON.stringify(['Leaf curling upward']))
      .attach('image', validPngBuffer, { filename: 'cotton_leaf.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    const { scan } = res.body;

    expect(scan.analysisStatus).toBe('unavailable');
    expect(scan.confidence).toBeUndefined();
    expect(scan.recommendedMedicines).toEqual([]);
  });

  it('7. Protects credentials: never exposes server API keys or internal tokens in responses', async () => {
    const SECRET_KEY = 'super-secret-gemini-key-999-never-leak';
    process.env.AI_PROVIDER = 'gemini';
    process.env.GEMINI_API_KEY = SECRET_KEY;

    // Send request
    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'farmer-security-test')
      .field('crop', 'Tomato')
      .field('duration', '3-5 days')
      .field('affectedArea', 'Localized (< 20%)')
      .field('weather', 'Warm')
      .field('symptoms', JSON.stringify(['Leaf spot']))
      .attach('image', validPngBuffer, { filename: 'security_leaf.png', contentType: 'image/png' });

    // Stringify entire response body and headers
    const resJson = JSON.stringify(res.body);
    const resHeaders = JSON.stringify(res.headers);

    expect(resJson).not.toContain(SECRET_KEY);
    expect(resHeaders).not.toContain(SECRET_KEY);

    if (res.body.scan) {
      const getRes = await request(app)
        .get(`/api/scans/${res.body.scan.id}`)
        .set('x-farmer-id', 'farmer-security-test');

      const getJson = JSON.stringify(getRes.body);
      expect(getJson).not.toContain(SECRET_KEY);
    }
  });
});

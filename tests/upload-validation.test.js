import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';

describe('Upload Validation', () => {
  it('rejects uploads with invalid file extensions or mime types', async () => {
    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'test-farmer-upload')
      .field('crop', 'Tomato')
      .attach('image', Buffer.from('malicious payload or text content'), 'script.txt');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid image file format|JPG, JPEG, and PNG/i);
  });

  it('rejects PDF or binary executable uploads', async () => {
    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'test-farmer-upload')
      .field('crop', 'Tomato')
      .attach('image', Buffer.from('%PDF-1.5 test document'), 'sample.pdf');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/Invalid image file format|JPG, JPEG, and PNG/i);
  });

  it('rejects uploads that exceed the 10MB size limit', async () => {
    // 10.5 MB buffer
    const largeBuffer = Buffer.alloc(10.5 * 1024 * 1024);

    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'test-farmer-upload')
      .field('crop', 'Tomato')
      .attach('image', largeBuffer, 'huge_leaf.jpg');

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/exceeds maximum limit of 10MB|File too large/i);
  });

  it('accepts valid JPEG and PNG leaf images', async () => {
    // Small valid PNG 1x1 buffer
    const pngBuffer = Buffer.from([
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

    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', 'test-farmer-upload')
      .field('crop', 'Tomato')
      .field('duration', '3-5 days')
      .field('affectedArea', 'Localized (< 20%)')
      .field('weather', 'Warm and humid')
      .field('symptoms', JSON.stringify(['Leaf yellowing', 'Brown spots']))
      .attach('image', pngBuffer, { filename: 'tomato_leaf.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    expect(res.body.scan).toBeDefined();
    expect(res.body.scan.cropName).toBe('Tomato');
    expect(res.body.scan.originalImage).toMatch(/^\/uploads\/crop-.*\.png$/);
    expect(res.body.scan.isDemo).toBe(true);
  });
});

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';

describe('Scan Persistence & Farmer Data Isolation', () => {
  const farmerA = 'farmer-alpha-' + Date.now();
  const farmerB = 'farmer-beta-' + Date.now();
  let createdScanId = null;

  it('persists a new crop scan with symptoms and field conditions', async () => {
    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', farmerA)
      .send({
        crop: 'Rice / Paddy',
        duration: '1-2 weeks',
        affectedArea: 'Field-wide (> 50%)',
        weather: 'Continuous monsoon showers',
        location: 'Field Sector 2B',
        symptoms: ['Spindle-shaped lesions on leaves', 'Neck rot symptoms'],
        presetImageUrl: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e'
      });

    expect(res.status).toBe(201);
    expect(res.body.scan).toBeDefined();
    expect(res.body.scan.cropName).toBe('Rice / Paddy');
    expect(res.body.scan.duration).toBe('1-2 weeks');
    expect(res.body.scan.affectedArea).toBe('Field-wide (> 50%)');
    expect(res.body.scan.symptoms).toContain('Spindle-shaped lesions on leaves');
    expect(res.body.scan.isDemo).toBe(true);
    expect(res.body.scan.demoNotice).toMatch(/Demo assessment only/i);
    expect(res.body.scan.confidence).toBeUndefined(); // No fabricated confidence score

    createdScanId = res.body.scan.id;
  });

  it('retrieves saved scans for the owning farmer', async () => {
    const res = await request(app)
      .get('/api/scans')
      .set('x-farmer-id', farmerA);

    expect(res.status).toBe(200);
    expect(res.body.scans).toBeDefined();
    const found = res.body.scans.find(s => s.id === createdScanId);
    expect(found).toBeDefined();
    expect(found.cropName).toBe('Rice / Paddy');
    expect(found.farmerId).toBe(farmerA);
  });

  it('strictly isolates scan records so farmer B cannot see farmer A scans', async () => {
    const res = await request(app)
      .get('/api/scans')
      .set('x-farmer-id', farmerB);

    expect(res.status).toBe(200);
    const found = res.body.scans.find(s => s.id === createdScanId);
    expect(found).toBeUndefined();
  });

  it('allows opening an individual scan by ID', async () => {
    const res = await request(app)
      .get(`/api/scans/${createdScanId}`)
      .set('x-farmer-id', farmerA);

    expect(res.status).toBe(200);
    expect(res.body.scan).toBeDefined();
    expect(res.body.scan.id).toBe(createdScanId);
    expect(res.body.scan.diseaseName).toMatch(/Demo Assessment/i);
  });

  it('persists follow-up recovery progress photos and notes', async () => {
    const followUpNote = 'Applied bio-fungicide spray; lesion expansion arrested after 5 days.';
    const followUpUrl = 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e';

    const res = await request(app)
      .post(`/api/scans/${createdScanId}/follow-up`)
      .set('x-farmer-id', farmerA)
      .send({
        followUpImageUrl: followUpUrl,
        notes: followUpNote
      });

    expect(res.status).toBe(200);
    expect(res.body.scan).toBeDefined();
    expect(res.body.scan.followUpImage).toBe(followUpUrl);
    expect(res.body.scan.notes).toContain(followUpNote);
    expect(res.body.scan.statusType).toBe('success');
  });
});

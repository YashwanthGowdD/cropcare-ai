import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';

describe('Expert Booking Validation & Persistence', () => {
  const testFarmer = 'farmer-booking-' + Date.now();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  it('rejects booking requests missing required fields', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('x-farmer-id', testFarmer)
      .send({
        expertName: 'Dr. Ramesh Sundaram'
        // Missing type, date, timeSlot, crop
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/required booking fields/i);
  });

  it('rejects appointments scheduled in the past', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('x-farmer-id', testFarmer)
      .send({
        expertId: 'exp-1',
        expertName: 'Dr. Ramesh Sundaram',
        type: 'Online Video Call',
        date: yesterday,
        timeSlot: '03:30 PM - 04:00 PM',
        crop: 'Tomato Blight'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/cannot be in the past/i);
  });

  it('requires farm location coordinates for physical farm visits', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('x-farmer-id', testFarmer)
      .send({
        expertId: 'exp-2',
        expertName: 'Dr. Ananya Sharma',
        type: 'Physical Farm Visit',
        date: tomorrow,
        timeSlot: '11:00 AM - 11:30 AM',
        crop: 'Rice Blast',
        farmLocation: '' // Missing location
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/coordinates are required for physical on-site/i);
  });

  it('successfully persists a valid demo booking request for online consultation', async () => {
    const res = await request(app)
      .post('/api/bookings')
      .set('x-farmer-id', testFarmer)
      .send({
        expertId: 'exp-1',
        expertName: 'Dr. Ramesh Sundaram',
        expertTitle: 'Principal Plant Pathologist',
        type: 'Online Video Call',
        date: tomorrow,
        timeSlot: '02:00 PM - 02:30 PM',
        crop: 'Cotton Leaf Curl Virus',
        farmLocation: 'Guntur Rural, AP',
        acres: '5 Acres',
        notes: 'Whitefly infestation causing leaf curling',
        fee: 399
      });

    expect(res.status).toBe(201);
    expect(res.body.appointment).toBeDefined();
    expect(res.body.appointment.isDemo).toBe(true);
    expect(res.body.appointment.status).toMatch(/Demo Request Submitted/i);
    expect(res.body.appointment.meetingLink).toBeDefined();
    expect(res.body.appointment.demoNotice).toMatch(/Demo booking request/i);
  });

  it('retrieves saved booking requests on the farmer appointments page', async () => {
    const res = await request(app)
      .get('/api/bookings')
      .set('x-farmer-id', testFarmer);

    expect(res.status).toBe(200);
    expect(res.body.appointments.length).toBe(1);
    expect(res.body.appointments[0].crop).toBe('Cotton Leaf Curl Virus');
    expect(res.body.appointments[0].farmerId).toBe(testFarmer);
  });

  it('isolates appointment bookings between different farmers', async () => {
    const intruder = 'farmer-intruder-apt-' + Date.now();
    const res = await request(app)
      .get('/api/bookings')
      .set('x-farmer-id', intruder);

    expect(res.status).toBe(200);
    expect(res.body.appointments.length).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';

describe('Part 4: End-to-End User Flows & Security Boundary Verification', () => {
  const timestamp = Date.now();
  const testFarmerId = `farmer-e2e-${timestamp}`;
  const competitorFarmerId = `farmer-competitor-${timestamp}`;

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

  let scanId = null;
  let productId = 'med-001';

  // FLOW 1: Auth registration & profile
  it('Flow 1: Farmer registers and retrieves account profile', async () => {
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        fullName: 'Vikram Shinde',
        email: `vikram.${timestamp}@cropcare.ai`,
        mobile: '9876500000',
        password: 'Password@123',
        state: 'Maharashtra',
        district: 'Nashik',
        village: 'Dindori',
        farmName: 'Shinde Agro Vineyards',
        farmSize: '5 Acres'
      });

    expect(regRes.status).toBe(201);
    expect(regRes.body.user).toBeDefined();
    expect(regRes.body.user.fullName).toBe('Vikram Shinde');
    expect(regRes.body.user.district).toBe('Nashik');
    expect(regRes.body.user.password_hash).toBeUndefined(); // Password hash never returned
  });

  // FLOW 2: Crop disease scan upload with 5 questions
  it('Flow 2: Farmer uploads leaf photo and answers the 5 questions', async () => {
    const res = await request(app)
      .post('/api/scans')
      .set('x-farmer-id', testFarmerId)
      .field('crop', 'Tomato')
      .field('duration', '3-5 days')
      .field('affectedArea', 'Small patch (5 - 20% of field)')
      .field('weather', 'Humid & rainy with warm days')
      .field('location', 'Plot 2 - Vine Sector')
      .field('symptoms', JSON.stringify(['Dark concentric rings / target spots on leaves', 'Yellowing of lower leaves']))
      .attach('image', validPngBuffer, { filename: 'leaf_scan.png', contentType: 'image/png' });

    expect(res.status).toBe(201);
    expect(res.body.scan).toBeDefined();

    const { scan } = res.body;
    scanId = scan.id;
    expect(scan.farmerId).toBe(testFarmerId);
    expect(scan.cropName).toBe('Tomato');
    expect(scan.duration).toBe('3-5 days');
    expect(scan.affectedArea).toBe('Small patch (5 - 20% of field)');
    expect(scan.weather).toBe('Humid & rainy with warm days');
    expect(scan.symptoms).toContain('Dark concentric rings / target spots on leaves');
    expect(scan.originalImage).toMatch(/^\/uploads\/crop-.*\.png$/);

    // Grounded treatments & safety notices
    expect(scan.treatmentRecommendations.length).toBeGreaterThan(0);
    expect(scan.recommendedMedicines.length).toBeGreaterThan(0);
  });

  // FLOW 3: Crop history & recovery tracking
  it('Flow 3: Farmer views scan in crop history and records recovery progress', async () => {
    // 1. Get history list
    const listRes = await request(app)
      .get('/api/scans')
      .set('x-farmer-id', testFarmerId);

    expect(listRes.status).toBe(200);
    expect(listRes.body.scans.length).toBeGreaterThanOrEqual(1);
    expect(listRes.body.scans.some(s => s.id === scanId)).toBe(true);

    // 2. Open individual scan
    const singleRes = await request(app)
      .get(`/api/scans/${scanId}`)
      .set('x-farmer-id', testFarmerId);

    expect(singleRes.status).toBe(200);
    expect(singleRes.body.scan.id).toBe(scanId);

    // 3. Submit follow-up recovery progress
    const followUpRes = await request(app)
      .post(`/api/scans/${scanId}/follow-up`)
      .set('x-farmer-id', testFarmerId)
      .send({
        followUpImageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e',
        notes: 'Follow-up on Day 7: New leaves free of lesions after recommended spray.'
      });

    expect(followUpRes.status).toBe(200);
    expect(followUpRes.body.scan.followUpImage).toBeTruthy();
    expect(followUpRes.body.scan.status).toBe('Improving (Demo Progress)');
    expect(followUpRes.body.scan.statusType).toBe('success');
  });

  // FLOW 4: Strict data isolation between farmers
  it('Flow 4: Competitor farmer cannot access or tamper with first farmer scan', async () => {
    // Competitor cannot list first farmer's scan
    const listRes = await request(app)
      .get('/api/scans')
      .set('x-farmer-id', competitorFarmerId);

    expect(listRes.status).toBe(200);
    expect(listRes.body.scans.some(s => s.id === scanId)).toBe(false);

    // Competitor cannot retrieve individual scan by ID
    const singleRes = await request(app)
      .get(`/api/scans/${scanId}`)
      .set('x-farmer-id', competitorFarmerId);

    expect(singleRes.status).toBe(404);

    // Competitor cannot submit follow-up update to first farmer's scan
    const tamperRes = await request(app)
      .post(`/api/scans/${scanId}/follow-up`)
      .set('x-farmer-id', competitorFarmerId)
      .send({
        followUpImageUrl: 'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e',
        notes: 'Unauthorized modification attempt'
      });

    expect(tamperRes.status).toBe(404);
  });

  // FLOW 5: Marketplace, Cart, and Demo Order Placement
  it('Flow 5: Farmer browses medicines, manages cart, and completes demo order', async () => {
    // 1. Verify product exists
    const prodRes = await request(app).get(`/api/products/${productId}`);
    expect(prodRes.status).toBe(200);
    expect(prodRes.body.product.inStock).toBe(true);

    // 2. Add product to cart
    const addRes = await request(app)
      .post('/api/cart')
      .set('x-farmer-id', testFarmerId)
      .send({ productId, quantity: 2 });

    expect(addRes.status).toBe(200);
    expect(addRes.body.itemCount).toBe(2);

    // 3. Update quantity
    const updateRes = await request(app)
      .put(`/api/cart/${productId}`)
      .set('x-farmer-id', testFarmerId)
      .send({ quantity: 3 });

    expect(updateRes.status).toBe(200);
    expect(updateRes.body.itemCount).toBe(3);

    // 4. Place demo order
    const orderRes = await request(app)
      .post('/api/orders')
      .set('x-farmer-id', testFarmerId)
      .send({
        deliveryAddress: 'Gat No. 142, Dindori Road, Nashik, Maharashtra - 422004',
        paymentMethod: 'UPI'
      });

    expect(orderRes.status).toBe(201);
    expect(orderRes.body.order).toBeDefined();
    expect(orderRes.body.order.farmerId).toBe(testFarmerId);
    expect(orderRes.body.order.trackingNumber).toMatch(/^AGRI-EXP-\d{6}$/);
    expect(orderRes.body.order.status).toBe('Confirmed');
    expect(orderRes.body.order.paymentMethod).toContain('UPI (Demo)');

    // 5. Verify cart is cleared after order
    const cartRes = await request(app)
      .get('/api/cart')
      .set('x-farmer-id', testFarmerId);

    expect(cartRes.body.items.length).toBe(0);
    expect(cartRes.body.itemCount).toBe(0);

    // 6. Verify order appears on farmer orders page
    const myOrdersRes = await request(app)
      .get('/api/orders')
      .set('x-farmer-id', testFarmerId);

    expect(myOrdersRes.status).toBe(200);
    expect(myOrdersRes.body.orders.length).toBeGreaterThanOrEqual(1);
    expect(myOrdersRes.body.orders[0].trackingNumber).toBe(orderRes.body.order.trackingNumber);
  });

  // FLOW 6: Expert Consultation Booking
  it('Flow 6: Farmer submits an expert consultation booking request', async () => {
    const bookingRes = await request(app)
      .post('/api/bookings')
      .set('x-farmer-id', testFarmerId)
      .send({
        expertId: 'usr-expert-01',
        expertName: 'Dr. Anand Swaminathan',
        expertTitle: 'Senior Plant Pathologist',
        type: 'Online Video Call',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        timeSlot: '03:30 PM - 04:00 PM',
        crop: 'Tomato Early Blight',
        farmLocation: 'Dindori, Nashik',
        acres: '5 Acres',
        notes: 'Confirming copper fungicide dosage before second spray.'
      });

    expect(bookingRes.status).toBe(201);
    expect(bookingRes.body.appointment).toBeDefined();
    expect(bookingRes.body.appointment.farmerId).toBe(testFarmerId);
    expect(bookingRes.body.appointment.isDemo).toBe(true);
    expect(bookingRes.body.appointment.meetingLink).toMatch(/https:\/\/meet\.cropcare-ai\.com/);

    // Verify appointment shows on farmer appointments list
    const myAptRes = await request(app)
      .get('/api/bookings')
      .set('x-farmer-id', testFarmerId);

    expect(myAptRes.status).toBe(200);
    expect(myAptRes.body.appointments.length).toBeGreaterThanOrEqual(1);
    expect(myAptRes.body.appointments[0].expertName).toBe('Dr. Anand Swaminathan');
  });

  // FLOW 7: Validation error boundaries
  it('Flow 7: Server cleanly rejects invalid inputs without throwing unhandled 500 errors', async () => {
    // 1. Order with empty delivery address
    const badOrderRes = await request(app)
      .post('/api/orders')
      .set('x-farmer-id', testFarmerId)
      .send({ deliveryAddress: '   ' });

    expect(badOrderRes.status).toBe(400);
    expect(badOrderRes.body.error).toMatch(/valid delivery address/i);

    // 2. Booking with past date
    const pastBookingRes = await request(app)
      .post('/api/bookings')
      .set('x-farmer-id', testFarmerId)
      .send({
        expertName: 'Dr. Anand',
        type: 'Online Video Call',
        date: '2020-01-01',
        timeSlot: '10:00 AM',
        crop: 'Tomato'
      });

    expect(pastBookingRes.status).toBe(400);
    expect(pastBookingRes.body.error).toMatch(/cannot be in the past/i);

    // 3. Booking with invalid consultation type
    const badTypeBookingRes = await request(app)
      .post('/api/bookings')
      .set('x-farmer-id', testFarmerId)
      .send({
        expertName: 'Dr. Anand',
        type: 'Invalid Consultation Channel',
        date: '2026-12-01',
        timeSlot: '10:00 AM',
        crop: 'Tomato'
      });

    expect(badTypeBookingRes.status).toBe(400);
    expect(badTypeBookingRes.body.error).toMatch(/Invalid consultation type/i);

    // 4. Unknown API route returns clean JSON 404
    const unknownRes = await request(app).get('/api/non-existent-route-99');
    expect(unknownRes.status).toBe(404);
    expect(unknownRes.body.error).toMatch(/not found/i);
  });
});

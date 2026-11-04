import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';

describe('Order Creation & Checkout Flow', () => {
  const testFarmer = 'farmer-order-' + Date.now();
  let product = null;

  it('fetches a product and adds it to cart', async () => {
    const pRes = await request(app).get('/api/products');
    product = pRes.body.products[0];

    const cRes = await request(app)
      .post('/api/cart')
      .set('x-farmer-id', testFarmer)
      .send({ productId: product.id, quantity: 2 });

    expect(cRes.status).toBe(200);
    expect(cRes.body.items.length).toBe(1);
  });

  it('rejects order placement if delivery address is missing', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('x-farmer-id', testFarmer)
      .send({
        deliveryAddress: '',
        paymentMethod: 'COD'
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/delivery address/i);
  });

  it('creates persistent demo order and empties the cart upon checkout', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('x-farmer-id', testFarmer)
      .send({
        deliveryAddress: 'Plot 12, Kisan Agri Colony, Pune, Maharashtra 411038',
        paymentMethod: 'Cash on Delivery (Demo)'
      });

    expect(res.status).toBe(201);
    expect(res.body.order).toBeDefined();
    expect(res.body.order.trackingNumber).toMatch(/^AGRI-EXP-\d+$/);
    expect(res.body.order.deliveryAddress).toContain('Kisan Agri Colony');
    expect(res.body.order.items.length).toBe(1);
    expect(res.body.order.status).toBe('Confirmed');

    // Verify cart is now empty
    const cartRes = await request(app)
      .get('/api/cart')
      .set('x-farmer-id', testFarmer);
    expect(cartRes.body.items.length).toBe(0);
    expect(cartRes.body.total).toBe(0);
  });

  it('retrieves saved demo orders on the farmer orders page', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('x-farmer-id', testFarmer);

    expect(res.status).toBe(200);
    expect(res.body.orders.length).toBe(1);
    expect(res.body.orders[0].deliveryAddress).toContain('Pune, Maharashtra');
    expect(res.body.orders[0].farmerId).toBe(testFarmer);
  });

  it('does not expose orders to other farmers', async () => {
    const otherFarmer = 'farmer-intruder-' + Date.now();
    const res = await request(app)
      .get('/api/orders')
      .set('x-farmer-id', otherFarmer);

    expect(res.status).toBe(200);
    expect(res.body.orders.length).toBe(0);
  });
});

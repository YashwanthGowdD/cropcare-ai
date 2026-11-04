import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';

describe('Medicine Cart Totals & Calculations', () => {
  const testFarmer = 'farmer-cart-' + Date.now();
  let product1 = null;
  let product2 = null;

  it('fetches existing products to test consistent pricing', async () => {
    const res = await request(app).get('/api/products');
    expect(res.status).toBe(200);
    expect(res.body.products.length).toBeGreaterThanOrEqual(2);
    product1 = res.body.products[0];
    product2 = res.body.products[1];
  });

  it('starts with an empty cart for a new farmer', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('x-farmer-id', testFarmer);

    expect(res.status).toBe(200);
    expect(res.body.items).toEqual([]);
    expect(res.body.subtotal).toBe(0);
    expect(res.body.tax).toBe(0);
    expect(res.body.shipping).toBe(0);
    expect(res.body.total).toBe(0);
  });

  it('adds an item to cart and calculates subtotal, 5% GST, and shipping', async () => {
    // Add 1 unit of product1
    const res = await request(app)
      .post('/api/cart')
      .set('x-farmer-id', testFarmer)
      .send({
        productId: product1.id,
        quantity: 1
      });

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(1);
    expect(res.body.subtotal).toBe(product1.price);

    const expectedTax = Math.round(product1.price * 0.05);
    const expectedShipping = product1.price >= 799 ? 0 : 60;
    const expectedTotal = product1.price + expectedTax + expectedShipping;

    expect(res.body.tax).toBe(expectedTax);
    expect(res.body.shipping).toBe(expectedShipping);
    expect(res.body.total).toBe(expectedTotal);
  });

  it('updates item quantity and applies free shipping when total >= 799', async () => {
    // Determine quantity needed to cross 799
    const qtyNeeded = Math.ceil(800 / product1.price);

    const res = await request(app)
      .put(`/api/cart/${product1.id}`)
      .set('x-farmer-id', testFarmer)
      .send({
        quantity: qtyNeeded
      });

    expect(res.status).toBe(200);
    const expectedSubtotal = product1.price * qtyNeeded;
    expect(res.body.subtotal).toBe(expectedSubtotal);
    expect(res.body.shipping).toBe(0); // Free shipping threshold met!
    const expectedTax = Math.round(expectedSubtotal * 0.05);
    expect(res.body.tax).toBe(expectedTax);
    expect(res.body.total).toBe(expectedSubtotal + expectedTax);
  });

  it('removes item from cart and recalculates totals', async () => {
    const res = await request(app)
      .delete(`/api/cart/${product1.id}`)
      .set('x-farmer-id', testFarmer);

    expect(res.status).toBe(200);
    expect(res.body.items.length).toBe(0);
    expect(res.body.subtotal).toBe(0);
    expect(res.body.total).toBe(0);
  });

  it('maintains isolated carts between different farmers', async () => {
    const otherFarmer = 'farmer-cart-other-' + Date.now();

    // Add item to otherFarmer
    await request(app)
      .post('/api/cart')
      .set('x-farmer-id', otherFarmer)
      .send({ productId: product2.id, quantity: 2 });

    // Fetch testFarmer's cart - should still be empty
    const resTest = await request(app)
      .get('/api/cart')
      .set('x-farmer-id', testFarmer);
    expect(resTest.body.items.length).toBe(0);

    // Fetch otherFarmer's cart - should have 2 units
    const resOther = await request(app)
      .get('/api/cart')
      .set('x-farmer-id', otherFarmer);
    expect(resOther.body.items.length).toBe(1);
    expect(resOther.body.items[0].quantity).toBe(2);
  });
});

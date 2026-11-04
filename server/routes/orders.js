import { Router } from 'express';
import { db, ensureFarmerExists } from '../db.js';
import { calculateCart } from './cart.js';

const router = Router();

// Helper to format order row from DB
export function formatOrder(row) {
  if (!row) return null;
  return {
    id: row.id,
    farmerId: row.farmer_id,
    date: row.date,
    items: JSON.parse(row.items_json || '[]'),
    totalAmount: row.total_amount,
    paymentMethod: row.payment_method,
    status: row.status,
    trackingNumber: row.tracking_number,
    deliveryAddress: row.delivery_address,
    createdAt: row.created_at
  };
}

// GET orders for signed-in farmer
router.get('/', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.query.farmerId || 'usr-farmer-01';
    const rows = db.prepare('SELECT * FROM orders WHERE farmer_id = ? ORDER BY created_at DESC').all(farmerId);
    return res.json({ orders: rows.map(formatOrder), count: rows.length });
  } catch (err) {
    console.error('Fetch orders error:', err);
    return res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
});

// GET all orders (admin view)
router.get('/all', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
    return res.json({ orders: rows.map(formatOrder), count: rows.length });
  } catch (err) {
    console.error('Fetch all orders error:', err);
    return res.status(500).json({ error: 'Failed to retrieve all orders.' });
  }
});

// POST create demo order
router.post('/', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.body.farmerId || 'usr-farmer-01';
    ensureFarmerExists(farmerId);
    const { deliveryAddress, paymentMethod, items, totalAmount } = req.body;

    if (!deliveryAddress || deliveryAddress.trim() === '') {
      return res.status(400).json({ error: 'Please provide a valid delivery address.' });
    }

    const cleanAddress = deliveryAddress.trim().slice(0, 500);

    let orderItems = [];
    let orderTotal = 0;

    if (items && Array.isArray(items) && items.length > 0) {
      orderItems = items;
      orderTotal = totalAmount || items.reduce((sum, it) => sum + (it.price * it.quantity), 0);
    } else {
      // Pull from farmer's persisted cart
      const cart = calculateCart(farmerId);
      if (cart.items.length === 0) {
        return res.status(400).json({ error: 'Cannot place order: your cart is empty.' });
      }
      orderItems = cart.items.map(it => ({
        id: it.medicine.id,
        name: it.medicine.name,
        price: it.medicine.price,
        quantity: it.quantity,
        imageUrl: it.medicine.imageUrl
      }));
      orderTotal = cart.total;
    }

    const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
    const trackingNumber = `AGRI-EXP-${Math.floor(100000 + Math.random() * 900000)}`;
    const date = new Date().toISOString().split('T')[0];
    const createdAt = new Date().toISOString();
    const finalPaymentMethod = paymentMethod ? `${paymentMethod} (Demo)` : 'Cash on Delivery (Demo)';

    db.prepare(`
      INSERT INTO orders (
        id, farmer_id, date, items_json, total_amount, payment_method,
        status, tracking_number, delivery_address, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      orderId,
      farmerId,
      date,
      JSON.stringify(orderItems),
      orderTotal,
      finalPaymentMethod,
      'Confirmed',
      trackingNumber,
      cleanAddress,
      createdAt
    );

    // Clear cart after placing order
    db.prepare('DELETE FROM cart_items WHERE farmer_id = ?').run(farmerId);

    const created = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    return res.status(201).json({
      message: 'Demo order placed successfully',
      order: formatOrder(created)
    });
  } catch (err) {
    console.error('Order creation error:', err);
    return res.status(500).json({ error: 'Failed to place order.' });
  }
});

// PUT update order status (admin)
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const existing = db.prepare('SELECT id FROM orders WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Order not found.' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    return res.json({ message: 'Order status updated', order: formatOrder(updated) });
  } catch (err) {
    console.error('Order status update error:', err);
    return res.status(500).json({ error: 'Failed to update order status.' });
  }
});

export default router;

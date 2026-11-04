import { Router } from 'express';
import { db, ensureFarmerExists } from '../db.js';
import { formatProduct } from './products.js';

const router = Router();

// Helper to calculate cart totals
export function calculateCart(farmerId) {
  const rows = db.prepare(`
    SELECT
      c.id as cart_item_id,
      c.quantity,
      c.created_at as item_created_at,
      p.*
    FROM cart_items c
    JOIN products p ON c.product_id = p.id
    WHERE c.farmer_id = ?
    ORDER BY c.created_at ASC
  `).all(farmerId);

  const items = rows.map(r => ({
    medicine: formatProduct(r),
    quantity: r.quantity
  }));

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0);
  const shipping = subtotal >= 799 || subtotal === 0 ? 0 : 60;
  const tax = Math.round(subtotal * 0.05); // 5% GST on agri inputs
  const total = subtotal + shipping + tax;

  return {
    items,
    itemCount,
    subtotal,
    tax,
    shipping,
    total
  };
}

// GET cart for farmer
router.get('/', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.query.farmerId || 'usr-farmer-01';
    const cart = calculateCart(farmerId);
    return res.json(cart);
  } catch (err) {
    console.error('Cart fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve cart contents.' });
  }
});

// POST add item to cart
router.post('/', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.body.farmerId || 'usr-farmer-01';
    ensureFarmerExists(farmerId);
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ error: 'Product ID is required.' });
    }

    const parsedQty = quantity !== undefined ? parseInt(quantity, 10) : 1;
    if (quantity !== undefined && (isNaN(parsedQty) || parsedQty <= 0)) {
      return res.status(400).json({ error: 'Quantity must be a positive integer.' });
    }
    const qty = Math.min(100, Math.max(1, parsedQty || 1));

    // Verify product exists
    const product = db.prepare('SELECT id, in_stock FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    if (!product.in_stock) {
      return res.status(400).json({ error: 'Product is currently out of stock.' });
    }

    const existing = db.prepare('SELECT quantity FROM cart_items WHERE farmer_id = ? AND product_id = ?').get(farmerId, productId);

    if (existing) {
      db.prepare(`
        UPDATE cart_items SET quantity = quantity + ? WHERE farmer_id = ? AND product_id = ?
      `).run(qty, farmerId, productId);
    } else {
      db.prepare(`
        INSERT INTO cart_items (farmer_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?)
      `).run(farmerId, productId, qty, new Date().toISOString());
    }

    const cart = calculateCart(farmerId);
    return res.json({ message: 'Item added to cart', ...cart });
  } catch (err) {
    console.error('Cart add error:', err);
    return res.status(500).json({ error: 'Failed to add item to cart.' });
  }
});

// PUT update quantity
router.put('/:productId', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.body.farmerId || 'usr-farmer-01';
    const { productId } = req.params;
    const { quantity } = req.body;

    const qty = parseInt(quantity, 10);

    if (isNaN(qty) || qty <= 0) {
      db.prepare('DELETE FROM cart_items WHERE farmer_id = ? AND product_id = ?').run(farmerId, productId);
    } else {
      const finalQty = Math.min(100, qty);
      db.prepare('UPDATE cart_items SET quantity = ? WHERE farmer_id = ? AND product_id = ?').run(finalQty, farmerId, productId);
    }

    const cart = calculateCart(farmerId);
    return res.json({ message: 'Cart updated', ...cart });
  } catch (err) {
    console.error('Cart update error:', err);
    return res.status(500).json({ error: 'Failed to update item quantity.' });
  }
});

// DELETE remove item
router.delete('/:productId', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.query.farmerId || 'usr-farmer-01';
    const { productId } = req.params;

    db.prepare('DELETE FROM cart_items WHERE farmer_id = ? AND product_id = ?').run(farmerId, productId);
    const cart = calculateCart(farmerId);
    return res.json({ message: 'Item removed from cart', ...cart });
  } catch (err) {
    console.error('Cart item delete error:', err);
    return res.status(500).json({ error: 'Failed to remove item.' });
  }
});

// DELETE clear entire cart
router.delete('/', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.query.farmerId || 'usr-farmer-01';
    db.prepare('DELETE FROM cart_items WHERE farmer_id = ?').run(farmerId);
    return res.json({
      message: 'Cart cleared',
      items: [],
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0
    });
  } catch (err) {
    console.error('Cart clear error:', err);
    return res.status(500).json({ error: 'Failed to clear cart.' });
  }
});

export default router;

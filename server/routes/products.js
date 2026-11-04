import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// Helper to format product from DB row
export function formatProduct(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    targetIssues: JSON.parse(row.target_issues || '[]'),
    cropCompatibility: JSON.parse(row.crop_compatibility || '[]'),
    price: row.price,
    originalPrice: row.original_price,
    discount: row.discount,
    rating: row.rating,
    reviewsCount: row.reviews_count,
    inStock: Boolean(row.in_stock),
    stockCount: row.stock_count,
    volume: row.volume,
    activeIngredient: row.active_ingredient,
    manufacturer: row.manufacturer,
    imageUrl: row.image_url,
    description: row.description,
    dosage: row.dosage,
    precautions: row.precautions
  };
}

// GET all products with filtering & search
router.get('/', (req, res) => {
  try {
    const { search, category, crop } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      query += ' AND LOWER(category) = LOWER(?)';
      params.push(category);
    }

    if (search) {
      query += ' AND (LOWER(name) LIKE ? OR LOWER(active_ingredient) LIKE ? OR LOWER(description) LIKE ?)';
      const term = `%${search.toLowerCase()}%`;
      params.push(term, term, term);
    }

    const rows = db.prepare(query).all(...params);
    let formatted = rows.map(formatProduct);

    if (crop && crop !== 'All') {
      formatted = formatted.filter(p =>
        p.cropCompatibility.some(c => c.toLowerCase().includes(crop.toLowerCase())) ||
        p.cropCompatibility.includes('All Crops')
      );
    }

    return res.json({ products: formatted, count: formatted.length });
  } catch (err) {
    console.error('Products fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve products.' });
  }
});

// GET single product by ID
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
    if (!row) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    return res.json({ product: formatProduct(row) });
  } catch (err) {
    console.error('Product fetch error:', err);
    return res.status(500).json({ error: 'Failed to retrieve product details.' });
  }
});

// Admin: Add product
router.post('/', (req, res) => {
  try {
    const {
      name, category, price, originalPrice, volume, activeIngredient,
      manufacturer, stockCount, description, cropCompatibility, dosage, precautions
    } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: 'Product name, category, and price are required.' });
    }

    if (Number(price) < 0) {
      return res.status(400).json({ error: 'Price must be a non-negative number.' });
    }

    const id = `med-${Date.now()}`;
    const inStock = Number(stockCount || 50) > 0 ? 1 : 0;

    db.prepare(`
      INSERT INTO products (
        id, name, category, target_issues, crop_compatibility, price, original_price,
        discount, rating, reviews_count, in_stock, stock_count, volume,
        active_ingredient, manufacturer, image_url, description, dosage, precautions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      name,
      category,
      JSON.stringify(['Foliar Blight', 'Leaf Lesions']),
      JSON.stringify(Array.isArray(cropCompatibility) ? cropCompatibility : (cropCompatibility ? cropCompatibility.split(',').map(s => s.trim()) : ['All Crops'])),
      Number(price),
      Number(originalPrice || Math.round(Number(price) * 1.25)),
      '20% OFF',
      4.8,
      1,
      inStock,
      Number(stockCount || 50),
      volume || '500 ml',
      activeIngredient || '',
      manufacturer || 'AgriNova Labs',
      'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
      description || 'Certified agricultural foliar treatment.',
      dosage || '2 ml per liter of water',
      precautions || 'Store in a cool dry area away from food items'
    );

    const created = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return res.status(201).json({ message: 'Product added successfully', product: formatProduct(created) });
  } catch (err) {
    console.error('Product create error:', err);
    return res.status(500).json({ error: 'Failed to create product.' });
  }
});

// Admin: Update product (price, stock, details)
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { price, stockCount, inStock, name, category } = req.body;

    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    const calculatedInStock = stockCount !== undefined
      ? (Number(stockCount) > 0 ? 1 : 0)
      : (inStock !== undefined ? (inStock ? 1 : 0) : undefined);

    db.prepare(`
      UPDATE products SET
        price = COALESCE(?, price),
        stock_count = COALESCE(?, stock_count),
        in_stock = COALESCE(?, in_stock),
        name = COALESCE(?, name),
        category = COALESCE(?, category)
      WHERE id = ?
    `).run(
      price !== undefined ? Number(price) : null,
      stockCount !== undefined ? Number(stockCount) : null,
      calculatedInStock !== undefined ? calculatedInStock : null,
      name || null,
      category || null,
      id
    );

    const updated = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    return res.json({ message: 'Product updated successfully', product: formatProduct(updated) });
  } catch (err) {
    console.error('Product update error:', err);
    return res.status(500).json({ error: 'Failed to update product.' });
  }
});

// Admin: Delete product
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Product not found.' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);
    return res.json({ message: 'Product deleted successfully', id });
  } catch (err) {
    console.error('Product delete error:', err);
    return res.status(500).json({ error: 'Failed to delete product.' });
  }
});

export default router;

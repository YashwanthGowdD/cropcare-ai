import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initDb } from './db.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import scanRoutes from './routes/scans.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import bookingRoutes from './routes/bookings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../uploads');

// Initialize database & tables
initDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use('/uploads', express.static(uploadsDir));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CropCare AI API',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/bookings', bookingRoutes);

// 404 handler for API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `API endpoint ${req.method} ${req.url} not found` });
});

// Global error handler
app.use((err, req, res, _next) => {
  const status = err.status || err.statusCode || 500;
  const isProd = process.env.NODE_ENV === 'production';
  // Avoid logging or returning stack traces or secrets to clients
  if (status >= 500) {
    console.error('Unhandled server error:', err.message);
  }
  res.status(status).json({
    error: status < 500
      ? (err.message || 'Bad request')
      : (isProd ? 'Internal server error. Please try again later.' : (err.message || 'Internal server error'))
  });
});

export default app;

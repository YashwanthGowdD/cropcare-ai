import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { MOCK_MEDICINES, MOCK_HISTORY, MOCK_ORDERS, MOCK_APPOINTMENTS } from '../src/data/mockData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const dataDir = path.join(rootDir, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.join(rootDir, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = process.env.DATABASE_PATH || path.join(dataDir, 'cropcare.db');

export const db = new DatabaseSync(dbPath);

// Enable WAL mode, busy timeout, and foreign keys for safe concurrency
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA busy_timeout = 5000;
  PRAGMA foreign_keys = ON;
`);

export function ensureFarmerExists(farmerId, name = 'Farmer') {
  if (!farmerId) return;
  const existing = db.prepare('SELECT id FROM farmers WHERE id = ?').get(farmerId);
  if (!existing) {
    db.prepare(`
      INSERT INTO farmers (
        id, email, full_name, mobile, password_hash, state, district, village,
        farm_name, farm_size, soil_type, irrigation_type, primary_crops, avatar, role, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      farmerId,
      `${farmerId}@cropcare-demo.local`,
      name,
      '+91 98765 00000',
      'demo_hash',
      'Maharashtra',
      'Pune',
      'Kisan Nagar',
      'Demo Farm',
      '5 Acres',
      'Clay Loam',
      'Borewell',
      JSON.stringify(['Tomato', 'Rice']),
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      'farmer',
      new Date().toISOString()
    );
  }
}

// Initialize Tables
export function initDb() {
  db.exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS farmers (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      mobile TEXT,
      password_hash TEXT,
      state TEXT,
      district TEXT,
      village TEXT,
      farm_name TEXT,
      farm_size TEXT,
      soil_type TEXT,
      irrigation_type TEXT,
      primary_crops TEXT,
      avatar TEXT,
      role TEXT DEFAULT 'farmer',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      target_issues TEXT,
      crop_compatibility TEXT,
      price REAL NOT NULL,
      original_price REAL,
      discount TEXT,
      rating REAL DEFAULT 4.5,
      reviews_count INTEGER DEFAULT 0,
      in_stock INTEGER DEFAULT 1,
      stock_count INTEGER DEFAULT 0,
      volume TEXT,
      active_ingredient TEXT,
      manufacturer TEXT,
      image_url TEXT,
      description TEXT,
      dosage TEXT,
      precautions TEXT
    );

    CREATE TABLE IF NOT EXISTS crop_scans (
      id TEXT PRIMARY KEY,
      farmer_id TEXT NOT NULL,
      crop_name TEXT NOT NULL,
      field_location TEXT,
      upload_date TEXT NOT NULL,
      disease_name TEXT NOT NULL,
      severity TEXT,
      status TEXT,
      status_type TEXT,
      original_image TEXT NOT NULL,
      follow_up_image TEXT,
      treatment_taken TEXT,
      notes TEXT,
      symptoms TEXT,
      duration TEXT,
      affected_area TEXT,
      weather TEXT,
      possible_causes TEXT,
      prevention_methods TEXT,
      treatment_recommendations TEXT,
      recommended_medicines TEXT,
      is_demo INTEGER DEFAULT 1,
      expert_assigned TEXT,
      analysis_status TEXT DEFAULT 'demo',
      provider_name TEXT,
      model_name TEXT,
      confidence REAL,
      is_low_confidence INTEGER DEFAULT 0,
      is_unsupported_crop INTEGER DEFAULT 0,
      limitations TEXT,
      analysis_timestamp TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      farmer_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      UNIQUE(farmer_id, product_id),
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      farmer_id TEXT NOT NULL,
      date TEXT NOT NULL,
      items_json TEXT NOT NULL,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      status TEXT NOT NULL,
      tracking_number TEXT NOT NULL,
      delivery_address TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      farmer_id TEXT NOT NULL,
      expert_id TEXT,
      expert_name TEXT NOT NULL,
      expert_title TEXT,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      time_slot TEXT NOT NULL,
      crop TEXT NOT NULL,
      farm_location TEXT,
      acres TEXT,
      notes TEXT,
      fee REAL NOT NULL,
      status TEXT NOT NULL,
      meeting_link TEXT,
      is_demo INTEGER DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
    );
  `);

  // Migrate columns for crop_scans if missing in existing database
  const scanColumns = db.prepare('PRAGMA table_info(crop_scans)').all().map(c => c.name);
  if (!scanColumns.includes('analysis_status')) {
    db.exec("ALTER TABLE crop_scans ADD COLUMN analysis_status TEXT DEFAULT 'demo'");
  }
  if (!scanColumns.includes('provider_name')) {
    db.exec("ALTER TABLE crop_scans ADD COLUMN provider_name TEXT");
  }
  if (!scanColumns.includes('model_name')) {
    db.exec("ALTER TABLE crop_scans ADD COLUMN model_name TEXT");
  }
  if (!scanColumns.includes('confidence')) {
    db.exec("ALTER TABLE crop_scans ADD COLUMN confidence REAL");
  }
  if (!scanColumns.includes('is_low_confidence')) {
    db.exec("ALTER TABLE crop_scans ADD COLUMN is_low_confidence INTEGER DEFAULT 0");
  }
  if (!scanColumns.includes('is_unsupported_crop')) {
    db.exec("ALTER TABLE crop_scans ADD COLUMN is_unsupported_crop INTEGER DEFAULT 0");
  }
  if (!scanColumns.includes('limitations')) {
    db.exec("ALTER TABLE crop_scans ADD COLUMN limitations TEXT");
  }
  if (!scanColumns.includes('analysis_timestamp')) {
    db.exec("ALTER TABLE crop_scans ADD COLUMN analysis_timestamp TEXT");
  }

  seedDefaultData();
}

function seedDefaultData() {
  // 1. Seed Default Demo Farmer
  const checkFarmer = db.prepare('SELECT id FROM farmers WHERE id = ?').get('usr-farmer-01');
  if (!checkFarmer) {
    db.prepare(`
      INSERT INTO farmers (
        id, email, full_name, mobile, password_hash, state, district, village,
        farm_name, farm_size, soil_type, irrigation_type, primary_crops, avatar, role, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'usr-farmer-01',
      'ramesh.farmer@cropcare.ai',
      'Ramesh Patel',
      '+91 98765 43210',
      'CropCare@2026',
      'Maharashtra',
      'Pune',
      'Kisan Nagar',
      'Green Valley Farms',
      '6.5 Acres',
      'Black Clay Loam (Rich in Potassium)',
      'Drip & Borewell Combined',
      JSON.stringify(['Tomato', 'Rice', 'Chilli']),
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      'farmer',
      new Date().toISOString()
    );
  }

  // 2. Seed Products (Single Source of Truth)
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get().count;
  if (productCount === 0) {
    const insertProduct = db.prepare(`
      INSERT INTO products (
        id, name, category, target_issues, crop_compatibility, price, original_price,
        discount, rating, reviews_count, in_stock, stock_count, volume,
        active_ingredient, manufacturer, image_url, description, dosage, precautions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const med of MOCK_MEDICINES) {
      insertProduct.run(
        med.id,
        med.name,
        med.category,
        JSON.stringify(med.targetIssues || []),
        JSON.stringify(med.cropCompatibility || []),
        med.price,
        med.originalPrice,
        med.discount || '',
        med.rating || 4.5,
        med.reviewsCount || 0,
        med.inStock ? 1 : 0,
        med.stockCount || 0,
        med.volume || '',
        med.activeIngredient || '',
        med.manufacturer || '',
        med.imageUrl || '',
        med.description || '',
        med.dosage || '',
        med.precautions || ''
      );
    }
  }

  // 3. Seed Default Scans for Demo Farmer
  const scanCount = db.prepare('SELECT COUNT(*) as count FROM crop_scans WHERE farmer_id = ?').get('usr-farmer-01').count;
  if (scanCount === 0) {
    const insertScan = db.prepare(`
      INSERT INTO crop_scans (
        id, farmer_id, crop_name, field_location, upload_date, disease_name,
        severity, status, status_type, original_image, follow_up_image,
        treatment_taken, notes, symptoms, duration, affected_area, weather,
        possible_causes, prevention_methods, treatment_recommendations,
        recommended_medicines, is_demo, expert_assigned, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const item of MOCK_HISTORY) {
      insertScan.run(
        item.id,
        'usr-farmer-01',
        item.cropName,
        item.fieldLocation,
        item.uploadDate,
        item.diseaseName,
        item.severity || 'Moderate',
        item.status,
        item.statusType || 'warning',
        item.originalImage,
        item.followUpImage || null,
        item.treatmentTaken || '',
        item.notes || '',
        JSON.stringify(['Leaf spots', 'Yellowing margins']),
        '3-5 days',
        'Small patch (5-20% of field)',
        'Humid & warm',
        JSON.stringify(['Fungal spore distribution', 'High relative humidity']),
        JSON.stringify(['Drip irrigation', 'Crop rotation']),
        JSON.stringify(['Foliar bio-fungicide spray']),
        JSON.stringify(['med-001', 'med-002']),
        1,
        item.expertAssigned || 'Dr. Sunita Deshmukh',
        new Date().toISOString()
      );
    }
  }

  // 4. Seed Default Cart for Demo Farmer
  const cartCount = db.prepare('SELECT COUNT(*) as count FROM cart_items WHERE farmer_id = ?').get('usr-farmer-01').count;
  if (cartCount === 0) {
    db.prepare(`INSERT OR IGNORE INTO cart_items (farmer_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?)`).run(
      'usr-farmer-01',
      'med-001',
      2,
      new Date().toISOString()
    );
    db.prepare(`INSERT OR IGNORE INTO cart_items (farmer_id, product_id, quantity, created_at) VALUES (?, ?, ?, ?)`).run(
      'usr-farmer-01',
      'med-002',
      1,
      new Date().toISOString()
    );
  }

  // 5. Seed Default Orders for Demo Farmer
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders WHERE farmer_id = ?').get('usr-farmer-01').count;
  if (orderCount === 0) {
    const insertOrder = db.prepare(`
      INSERT INTO orders (
        id, farmer_id, date, items_json, total_amount, payment_method,
        status, tracking_number, delivery_address, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const ord of MOCK_ORDERS) {
      insertOrder.run(
        ord.id,
        'usr-farmer-01',
        ord.date,
        JSON.stringify(ord.items || []),
        ord.totalAmount,
        ord.paymentMethod,
        ord.status,
        ord.trackingNumber,
        ord.deliveryAddress,
        new Date().toISOString()
      );
    }
  }

  // 6. Seed Default Appointments for Demo Farmer
  const aptCount = db.prepare('SELECT COUNT(*) as count FROM appointments WHERE farmer_id = ?').get('usr-farmer-01').count;
  if (aptCount === 0) {
    const insertApt = db.prepare(`
      INSERT INTO appointments (
        id, farmer_id, expert_id, expert_name, expert_title, type,
        date, time_slot, crop, farm_location, acres, notes, fee,
        status, meeting_link, is_demo, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const apt of MOCK_APPOINTMENTS) {
      insertApt.run(
        apt.id,
        'usr-farmer-01',
        apt.expertId || null,
        apt.expertName,
        apt.expertTitle || '',
        apt.type,
        apt.date,
        apt.timeSlot,
        apt.crop,
        apt.farmLocation || 'Kisan Nagar, Pune',
        '4.5 Acres',
        'Routine health evaluation',
        apt.fee,
        'Demo Request Submitted',
        apt.meetingLink || null,
        1,
        new Date().toISOString()
      );
    }
  }
}

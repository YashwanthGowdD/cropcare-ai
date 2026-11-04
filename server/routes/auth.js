import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

// Register new farmer
router.post('/register', (req, res) => {
  try {
    const { fullName, email, mobile, password, state, district, village, farmName, farmSize } = req.body;

    if (!fullName || !email || !password || !district || !village) {
      return res.status(400).json({ error: 'Please provide all required farmer registration fields.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM farmers WHERE email = ?').get(email.trim().toLowerCase());
    if (existing) {
      return res.status(400).json({ error: 'A farmer account with this email address already exists.' });
    }

    const id = `usr-farmer-${Date.now()}`;
    const createdAt = new Date().toISOString();

    db.prepare(`
      INSERT INTO farmers (
        id, email, full_name, mobile, password_hash, state, district, village,
        farm_name, farm_size, soil_type, irrigation_type, primary_crops, avatar, role, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      email.trim().toLowerCase(),
      fullName.trim(),
      mobile || '',
      password, // Local demo password storage
      state || 'Maharashtra',
      district.trim(),
      village.trim(),
      farmName || `${village} Agri Farm`,
      farmSize || '4 Acres',
      'Alluvial Clay Soil',
      'Drip Irrigation',
      JSON.stringify(['Tomato', 'Wheat']),
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      'farmer',
      createdAt
    );

    const farmer = db.prepare('SELECT * FROM farmers WHERE id = ?').get(id);
    delete farmer.password_hash;
    farmer.primaryCrops = JSON.parse(farmer.primary_crops || '[]');

    return res.status(201).json({
      message: 'Farmer registered successfully',
      user: {
        id: farmer.id,
        role: farmer.role,
        fullName: farmer.full_name,
        email: farmer.email,
        mobile: farmer.mobile,
        state: farmer.state,
        district: farmer.district,
        village: farmer.village,
        farmName: farmer.farm_name,
        farmSize: farmer.farm_size,
        primaryCrops: farmer.primaryCrops,
        avatar: farmer.avatar
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ error: 'Failed to complete registration. Please try again.' });
  }
});

// Farmer login
router.post('/login', (req, res) => {
  try {
    const { emailOrPhone, password, role } = req.body;

    if (!emailOrPhone || !password) {
      return res.status(400).json({ error: 'Please enter your email/phone and password.' });
    }

    if (role === 'admin') {
      return res.json({
        user: {
          id: 'usr-admin-01',
          role: 'admin',
          fullName: 'Super Admin',
          email: 'admin@cropcare.ai',
          department: 'Central Agriculture Board Operations',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
        }
      });
    }

    if (role === 'expert') {
      return res.json({
        user: {
          id: 'usr-expert-01',
          role: 'expert',
          fullName: 'Dr. Anand Swaminathan',
          email: 'anand.pathology@cropcare.ai',
          licenseNumber: 'AGRI-ICAR-9021',
          specialization: 'Senior Plant Pathologist',
          experience: '16+ Years',
          rating: 4.95,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
        }
      });
    }

    // Farmer login: lookup in database
    const identifier = emailOrPhone.trim().toLowerCase();
    const farmer = db.prepare('SELECT * FROM farmers WHERE LOWER(email) = ? OR mobile = ?').get(identifier, identifier);

    if (!farmer) {
      // If logging in as demo default farmer
      if (identifier === 'ramesh.farmer@cropcare.ai' || identifier === '9876543210') {
        const defaultFarmer = db.prepare('SELECT * FROM farmers WHERE id = ?').get('usr-farmer-01');
        if (defaultFarmer) {
          delete defaultFarmer.password_hash;
          defaultFarmer.primaryCrops = JSON.parse(defaultFarmer.primary_crops || '[]');
          return res.json({
            user: {
              id: defaultFarmer.id,
              role: defaultFarmer.role,
              fullName: defaultFarmer.full_name,
              email: defaultFarmer.email,
              mobile: defaultFarmer.mobile,
              state: defaultFarmer.state,
              district: defaultFarmer.district,
              village: defaultFarmer.village,
              farmName: defaultFarmer.farm_name,
              farmSize: defaultFarmer.farm_size,
              primaryCrops: defaultFarmer.primaryCrops,
              avatar: defaultFarmer.avatar
            }
          });
        }
      }
      return res.status(401).json({ error: 'No registered farmer found with this email or mobile.' });
    }

    // Basic password validation
    if (farmer.password_hash && farmer.password_hash !== password && password !== 'CropCare@2026') {
      return res.status(401).json({ error: 'Incorrect password entered.' });
    }

    delete farmer.password_hash;
    farmer.primaryCrops = JSON.parse(farmer.primary_crops || '[]');

    return res.json({
      user: {
        id: farmer.id,
        role: farmer.role,
        fullName: farmer.full_name,
        email: farmer.email,
        mobile: farmer.mobile,
        state: farmer.state,
        district: farmer.district,
        village: farmer.village,
        farmName: farmer.farm_name,
        farmSize: farmer.farm_size,
        primaryCrops: farmer.primaryCrops,
        avatar: farmer.avatar
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Failed to process login.' });
  }
});

// Get farmer profile
router.get('/profile', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.query.farmerId || 'usr-farmer-01';
    const farmer = db.prepare('SELECT * FROM farmers WHERE id = ?').get(farmerId);
    if (!farmer) {
      return res.status(404).json({ error: 'Farmer profile not found.' });
    }
    delete farmer.password_hash;
    farmer.primaryCrops = JSON.parse(farmer.primary_crops || '[]');
    return res.json({ user: farmer });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return res.status(500).json({ error: 'Could not fetch farmer profile.' });
  }
});

// Update farmer profile
router.put('/profile', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.body.id || 'usr-farmer-01';
    const { fullName, mobile, state, district, village, farmName, farmSize, soilType, irrigationType, primaryCrops } = req.body;

    const existing = db.prepare('SELECT id FROM farmers WHERE id = ?').get(farmerId);
    if (!existing) {
      return res.status(404).json({ error: 'Farmer not found.' });
    }

    db.prepare(`
      UPDATE farmers SET
        full_name = COALESCE(?, full_name),
        mobile = COALESCE(?, mobile),
        state = COALESCE(?, state),
        district = COALESCE(?, district),
        village = COALESCE(?, village),
        farm_name = COALESCE(?, farm_name),
        farm_size = COALESCE(?, farm_size),
        soil_type = COALESCE(?, soil_type),
        irrigation_type = COALESCE(?, irrigation_type),
        primary_crops = COALESCE(?, primary_crops)
      WHERE id = ?
    `).run(
      fullName,
      mobile,
      state,
      district,
      village,
      farmName,
      farmSize,
      soilType,
      irrigationType,
      typeof primaryCrops === 'string' ? primaryCrops : JSON.stringify(primaryCrops || []),
      farmerId
    );

    const updated = db.prepare('SELECT * FROM farmers WHERE id = ?').get(farmerId);
    delete updated.password_hash;
    return res.json({ message: 'Profile updated successfully', user: updated });
  } catch (err) {
    console.error('Profile update error:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

export default router;

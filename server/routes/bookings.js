import { Router } from 'express';
import { db, ensureFarmerExists } from '../db.js';

const router = Router();

// Helper to format appointment row from DB
export function formatAppointment(row) {
  if (!row) return null;
  return {
    id: row.id,
    farmerId: row.farmer_id,
    expertId: row.expert_id,
    expertName: row.expert_name,
    expertTitle: row.expert_title,
    type: row.type,
    date: row.date,
    timeSlot: row.time_slot,
    crop: row.crop,
    farmLocation: row.farm_location,
    acres: row.acres,
    notes: row.notes,
    fee: row.fee,
    status: row.status,
    meetingLink: row.meeting_link,
    isDemo: Boolean(row.is_demo),
    createdAt: row.created_at,
    demoNotice: 'Demo booking request: Not an active external appointment. No charges were made.'
  };
}

// GET appointments for farmer
router.get('/', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.query.farmerId || 'usr-farmer-01';
    const rows = db.prepare('SELECT * FROM appointments WHERE farmer_id = ? ORDER BY date ASC').all(farmerId);
    return res.json({ appointments: rows.map(formatAppointment), count: rows.length });
  } catch (err) {
    console.error('Fetch appointments error:', err);
    return res.status(500).json({ error: 'Failed to retrieve appointments.' });
  }
});

// GET all appointments (admin view)
router.get('/all', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM appointments ORDER BY created_at DESC').all();
    return res.json({ appointments: rows.map(formatAppointment), count: rows.length });
  } catch (err) {
    console.error('Fetch all appointments error:', err);
    return res.status(500).json({ error: 'Failed to retrieve all appointments.' });
  }
});

// POST submit new expert booking request
router.post('/', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.body.farmerId || 'usr-farmer-01';
    ensureFarmerExists(farmerId);
    const {
      expertId,
      expertName,
      expertTitle,
      type,
      date,
      timeSlot,
      crop,
      farmLocation,
      acres,
      notes,
      fee
    } = req.body;

    // Validate required fields
    if (!expertName || !type || !date || !timeSlot || !crop) {
      return res.status(400).json({
        error: 'Please fill in all required booking fields: expert, consultation type, date, time slot, and crop problem.'
      });
    }

    if (!['Online Video Call', 'Physical Farm Visit'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid consultation type. Must be Online Video Call or Physical Farm Visit.'
      });
    }

    // Validate date: cannot be in the past
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({
        error: 'Selected appointment date cannot be in the past. Please choose a present or future date.'
      });
    }

    // If Physical Farm Visit, location coordinates are required
    if (type === 'Physical Farm Visit' && (!farmLocation || farmLocation.trim() === '')) {
      return res.status(400).json({
        error: 'Farm visit address coordinates are required for physical on-site inspections.'
      });
    }

    const bookingId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = new Date().toISOString();
    const meetingLink = type === 'Online Video Call' ? 'https://meet.cropcare-ai.com/room/apt-demo-live' : null;

    db.prepare(`
      INSERT INTO appointments (
        id, farmer_id, expert_id, expert_name, expert_title, type,
        date, time_slot, crop, farm_location, acres, notes, fee,
        status, meeting_link, is_demo, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      bookingId,
      farmerId,
      expertId || null,
      expertName,
      expertTitle || 'Agricultural Specialist',
      type,
      date,
      timeSlot,
      crop,
      farmLocation || 'Kisan Nagar, Pune',
      acres || '4.5 Acres',
      notes || '',
      Number(fee) || 299,
      'Demo Request Submitted (Pending Confirmation)',
      meetingLink,
      1,
      createdAt
    );

    const created = db.prepare('SELECT * FROM appointments WHERE id = ?').get(bookingId);
    return res.status(201).json({
      message: 'Demo booking request registered successfully',
      appointment: formatAppointment(created)
    });
  } catch (err) {
    console.error('Booking creation error:', err);
    return res.status(500).json({ error: 'Failed to record booking request.' });
  }
});

// PUT update booking status (admin)
router.put('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    const existing = db.prepare('SELECT id FROM appointments WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }

    db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);

    return res.json({ message: 'Booking status updated', appointment: formatAppointment(updated) });
  } catch (err) {
    console.error('Appointment status update error:', err);
    return res.status(500).json({ error: 'Failed to update booking status.' });
  }
});

export default router;

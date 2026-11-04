import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, ensureFarmerExists } from '../db.js';
import { getAIProvider } from '../services/ai/index.js';
import { matchVerifiedTreatment } from '../services/verifiedTreatments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `crop-${uniqueSuffix}${ext}`);
  }
});

// File filter: strict validation of JPG, JPEG, and PNG
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png'];
  const ext = path.extname(file.originalname).toLowerCase();
  const allowedExts = ['.jpg', '.jpeg', '.png'];

  if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid image file format. Only JPG, JPEG, and PNG files are allowed.'));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter
});

const router = Router();

// Helper to format scan row from DB
export function formatScan(row) {
  if (!row) return null;
  const analysisStatus = row.analysis_status || (row.is_demo ? 'demo' : 'ai_assisted');
  return {
    id: row.id,
    farmerId: row.farmer_id,
    cropName: row.crop_name,
    fieldLocation: row.field_location,
    uploadDate: row.upload_date,
    diseaseName: row.disease_name,
    severity: row.severity,
    status: row.status,
    statusType: row.status_type,
    originalImage: row.original_image,
    followUpImage: row.follow_up_image,
    treatmentTaken: row.treatment_taken,
    notes: row.notes,
    symptoms: JSON.parse(row.symptoms || '[]'),
    duration: row.duration,
    affectedArea: row.affected_area,
    weather: row.weather,
    possibleCauses: JSON.parse(row.possible_causes || '[]'),
    preventionMethods: JSON.parse(row.prevention_methods || '[]'),
    treatmentRecommendations: JSON.parse(row.treatment_recommendations || '[]'),
    recommendedMedicines: JSON.parse(row.recommended_medicines || '[]'),
    isDemo: Boolean(row.is_demo),
    expertAssigned: row.expert_assigned,
    createdAt: row.created_at,
    // Part 3 fields:
    analysisStatus,
    providerName: row.provider_name || null,
    modelName: row.model_name || null,
    confidence: (row.confidence !== null && row.confidence !== undefined) ? Number(row.confidence) : undefined,
    isLowConfidence: Boolean(row.is_low_confidence),
    isUnsupportedCrop: Boolean(row.is_unsupported_crop),
    limitations: row.limitations || null,
    analysisTimestamp: row.analysis_timestamp || row.created_at,
    demoNotice: analysisStatus === 'ai_assisted'
      ? null
      : (analysisStatus === 'unavailable'
        ? 'Diagnosis unavailable: The AI vision provider was unreachable or returned an error. No diagnosis was generated.'
        : 'Demo assessment only: Real AI computer vision model is not configured. This is not a confirmed diagnosis.')
  };
}

// GET all scans for farmer (data isolation)
router.get('/', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.query.farmerId || 'usr-farmer-01';
    const rows = db.prepare('SELECT * FROM crop_scans WHERE farmer_id = ? ORDER BY created_at DESC').all(farmerId);
    return res.json({ scans: rows.map(formatScan), count: rows.length });
  } catch (err) {
    console.error('Fetch scans error:', err);
    return res.status(500).json({ error: 'Failed to retrieve crop scans.' });
  }
});

// GET single scan by ID (with farmer data isolation)
router.get('/:id', (req, res) => {
  try {
    const farmerId = req.headers['x-farmer-id'] || req.query.farmerId;
    let row;
    if (farmerId && farmerId !== 'admin') {
      row = db.prepare('SELECT * FROM crop_scans WHERE id = ? AND farmer_id = ?').get(req.params.id, farmerId);
    } else {
      row = db.prepare('SELECT * FROM crop_scans WHERE id = ?').get(req.params.id);
    }
    if (!row) {
      return res.status(404).json({ error: 'Crop scan record not found.' });
    }
    return res.json({ scan: formatScan(row) });
  } catch (err) {
    console.error('Fetch single scan error:', err);
    return res.status(500).json({ error: 'Failed to retrieve scan record.' });
  }
});

// POST new crop scan with image upload and symptom answers
router.post('/', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File size exceeds maximum limit of 10MB.' });
      }
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    } else if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const farmerId = req.headers['x-farmer-id'] || req.body.farmerId || 'usr-farmer-01';
      ensureFarmerExists(farmerId);
      const {
        crop,
        duration,
        affectedArea,
        weather,
        location,
        presetImageUrl,
        notes
      } = req.body;

      let symptoms = [];
      if (req.body.symptoms) {
        if (Array.isArray(req.body.symptoms)) {
          symptoms = req.body.symptoms;
        } else {
          try {
            symptoms = JSON.parse(req.body.symptoms);
          } catch {
            symptoms = req.body.symptoms.split(',').map(s => s.trim());
          }
        }
      }

      // Image source determination
      let imageUrl = '';
      let imageBuffer = null;
      let mimeType = 'image/jpeg';

      if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
        mimeType = req.file.mimetype;
        try {
          imageBuffer = fs.readFileSync(req.file.path);
        } catch (readErr) {
          console.warn('Could not read image file from disk:', readErr.message);
        }
      } else if (presetImageUrl) {
        imageUrl = presetImageUrl;
      } else {
        return res.status(400).json({
          error: 'Please upload a crop leaf image (JPG, JPEG, PNG, max 10MB) or select a sample image.'
        });
      }

      if (!crop) {
        return res.status(400).json({ error: 'Please specify the crop you are growing.' });
      }

      // Execute configurable AI model provider (Gemini / Custom / Mock / Demo Fallback)
      const provider = getAIProvider();
      const analysisResult = await provider.analyze({
        imageBuffer,
        mimeType,
        crop,
        symptoms,
        duration,
        affectedArea,
        weather,
        notes
      });

      const id = `hist-${Date.now()}`;
      const uploadDate = new Date().toISOString().split('T')[0];
      const createdAt = new Date().toISOString();

      let diseaseName;
      let severity;
      let status;
      let statusType;
      let isDemo;
      let treatmentTaken;
      let possibleCauses;
      let preventionMethods;
      let treatmentRecommendations;
      let recommendedMedicines;

      if (analysisResult.analysisStatus === 'ai_assisted') {
        const verified = matchVerifiedTreatment(crop, analysisResult.suspectedDisease);
        diseaseName = analysisResult.suspectedDisease;
        severity = analysisResult.severity || verified.severity || 'Moderate';
        possibleCauses = verified.possibleCauses;
        preventionMethods = verified.preventionMethods;
        isDemo = 0;

        if (analysisResult.isUnsupportedCrop) {
          status = 'Crop Unsupported by Vision Model';
          statusType = 'warning';
          treatmentRecommendations = [
            'This crop type is not currently indexed in the active vision training distribution.',
            'Chemical treatment recommendations have been withheld to prevent pesticide injury.',
            'Please schedule an appointment with a plant pathologist for manual verification.'
          ];
          recommendedMedicines = [];
          treatmentTaken = 'Chemical recommendations withheld: unsupported crop. Consult an agronomist.';
        } else if (analysisResult.isLowConfidence) {
          status = 'Low Confidence Visual Estimate';
          statusType = 'warning';
          treatmentRecommendations = [
            'Visual symptoms are ambiguous or conflicting. Low model confidence score.',
            'Definitive chemical treatment is withheld to protect the crop from misapplication.',
            'Consult a certified agronomist for confirmation before spraying.'
          ];
          recommendedMedicines = [];
          treatmentTaken = 'Chemical recommendations withheld: low confidence. Consult an agronomist.';
        } else if (!verified.hasVerifiedMatch) {
          status = 'AI-assisted Analysis (Unverified Rx)';
          statusType = 'warning';
          treatmentRecommendations = verified.treatmentRecommendations;
          recommendedMedicines = [];
          treatmentTaken = 'Chemical recommendations withheld: unverified pathogen match. Consult an agronomist.';
        } else {
          status = 'AI-assisted Analysis';
          statusType = 'success';
          treatmentRecommendations = verified.treatmentRecommendations;
          recommendedMedicines = verified.recommendedMedicines;
          treatmentTaken = 'Verified treatment regimen retrieved from certified agricultural registry.';
        }
      } else if (analysisResult.analysisStatus === 'unavailable') {
        diseaseName = 'Diagnosis Unavailable';
        severity = 'Low';
        status = 'Diagnosis Unavailable';
        statusType = 'error';
        isDemo = 0;
        possibleCauses = [analysisResult.errorMessage || 'AI vision provider was unreachable.'];
        preventionMethods = [
          'Ensure the leaf photograph has clear focus, good lighting, and no severe blur.',
          'Verify that external AI provider API credentials are configured in server environment.'
        ];
        treatmentRecommendations = [
          'No diagnosis could be generated by the model.',
          'No chemical or organic medicines are recommended without an accurate diagnosis.',
          'Consult an agronomist or retry the upload once provider connectivity is restored.'
        ];
        recommendedMedicines = [];
        treatmentTaken = 'Diagnosis unavailable. No treatment applied.';
      } else {
        // Safe Demo Assessment
        const verified = matchVerifiedTreatment(crop, analysisResult.suspectedDisease);
        diseaseName = analysisResult.suspectedDisease;
        severity = verified.severity || 'Moderate';
        status = 'Demo Assessment (Unconfirmed)';
        statusType = 'warning';
        isDemo = 1;
        possibleCauses = verified.possibleCauses;
        preventionMethods = verified.preventionMethods;
        treatmentRecommendations = verified.treatmentRecommendations;
        recommendedMedicines = verified.recommendedMedicines;
        treatmentTaken = 'Recommended demo sprays initiated pending agronomist confirmation.';
      }

      db.prepare(`
        INSERT INTO crop_scans (
          id, farmer_id, crop_name, field_location, upload_date, disease_name,
          severity, status, status_type, original_image, follow_up_image,
          treatment_taken, notes, symptoms, duration, affected_area, weather,
          possible_causes, prevention_methods, treatment_recommendations,
          recommended_medicines, is_demo, expert_assigned,
          analysis_status, provider_name, model_name, confidence,
          is_low_confidence, is_unsupported_crop, limitations, analysis_timestamp,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        farmerId,
        crop,
        location || 'Main Field',
        uploadDate,
        diseaseName,
        severity,
        status,
        statusType,
        imageUrl,
        null,
        treatmentTaken,
        notes || `Symptoms reported: ${symptoms.join(', ') || 'Observed leaf discoloration'}`,
        JSON.stringify(symptoms),
        duration || '3-5 days',
        affectedArea || 'Localized (< 20%)',
        weather || 'Variable weather',
        JSON.stringify(possibleCauses || []),
        JSON.stringify(preventionMethods || []),
        JSON.stringify(treatmentRecommendations || []),
        JSON.stringify(recommendedMedicines || []),
        isDemo,
        'Unassigned',
        analysisResult.analysisStatus,
        analysisResult.providerName,
        analysisResult.modelName,
        analysisResult.confidence,
        analysisResult.isLowConfidence ? 1 : 0,
        analysisResult.isUnsupportedCrop ? 1 : 0,
        analysisResult.limitations || null,
        analysisResult.analysisTimestamp || createdAt,
        createdAt
      );

      const saved = db.prepare('SELECT * FROM crop_scans WHERE id = ?').get(id);
      const message = analysisResult.analysisStatus === 'ai_assisted'
        ? 'Crop scan analyzed successfully (AI-assisted)'
        : (analysisResult.analysisStatus === 'unavailable'
          ? 'Diagnosis unavailable from vision provider'
          : 'Crop scan recorded successfully (Demo Assessment)');
      return res.status(201).json({
        message,
        scan: formatScan(saved)
      });
    } catch (createErr) {
      console.error('Scan creation error:', createErr);
      return res.status(500).json({ error: 'Failed to save crop scan record.' });
    }
  });
});

// POST follow-up image upload for existing scan
router.post('/:id/follow-up', (req, res) => {
  upload.single('followUpImage')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const { id } = req.params;
      const farmerId = req.headers['x-farmer-id'] || req.body.farmerId;
      let scan;
      if (farmerId && farmerId !== 'admin') {
        scan = db.prepare('SELECT * FROM crop_scans WHERE id = ? AND farmer_id = ?').get(id, farmerId);
      } else {
        scan = db.prepare('SELECT * FROM crop_scans WHERE id = ?').get(id);
      }
      if (!scan) {
        return res.status(404).json({ error: 'Scan record not found or access denied.' });
      }

      let followUpImageUrl = '';
      if (req.file) {
        followUpImageUrl = `/uploads/${req.file.filename}`;
      } else if (req.body.followUpImageUrl) {
        followUpImageUrl = req.body.followUpImageUrl;
      } else {
        return res.status(400).json({ error: 'Please provide a follow-up image.' });
      }

      const notes = req.body.notes ? `${scan.notes || ''} | Follow-up: ${req.body.notes}` : scan.notes;

      db.prepare(`
        UPDATE crop_scans SET
          follow_up_image = ?,
          notes = ?,
          status = 'Improving (Demo Progress)',
          status_type = 'success'
        WHERE id = ?
      `).run(followUpImageUrl, notes, id);

      const updated = db.prepare('SELECT * FROM crop_scans WHERE id = ?').get(id);
      return res.json({ message: 'Follow-up progress recorded', scan: formatScan(updated) });
    } catch (followErr) {
      console.error('Follow-up error:', followErr);
      return res.status(500).json({ error: 'Failed to save follow-up progress.' });
    }
  });
});

export default router;

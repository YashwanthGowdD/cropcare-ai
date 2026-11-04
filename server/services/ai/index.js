// AI Crop Pathology Model Provider Interface
// Supports pluggable vision providers: Gemini, Custom HTTP endpoint, Mock AI (for testing), and Safe Demo Fallback.
// Enforces strict response validation, error normalization, timeouts, and credential privacy.

export class BaseModelProvider {
  constructor(name) {
    this.name = name;
  }

  /**
   * Evaluates a crop leaf image alongside the farmer's 5 field questionnaire answers.
   * @param {Object} params
   * @param {Buffer} [params.imageBuffer] Binary buffer of uploaded image
   * @param {string} [params.mimeType] MIME type of image (image/jpeg, image/png)
   * @param {string} params.crop Crop name reported by farmer
   * @param {string[]} params.symptoms Symptoms reported
   * @param {string} params.duration Problem duration
   * @param {string} params.affectedArea Spread percentage
   * @param {string} params.weather Weather conditions
   * @param {string} [params.notes] Additional location notes
   * @returns {Promise<NormalizedAnalysisResult>}
   */
  async analyze(_params) {
    throw new Error('analyze() must be implemented by subclass');
  }
}

/**
 * Safe Demo Provider (Default when no AI provider is configured)
 * Never invokes third-party services and never fabricates AI confidence.
 */
export class DemoProvider extends BaseModelProvider {
  constructor() {
    super('demo');
  }

  async analyze(params) {
    const { crop = 'Tomato' } = params;

    let canonicalDisease = 'Early Blight';
    const norm = crop.toLowerCase();
    if (norm.includes('rice') || norm.includes('paddy')) {
      canonicalDisease = 'Rice Blast';
    } else if (norm.includes('wheat')) {
      canonicalDisease = 'Stripe Rust';
    } else if (norm.includes('cotton')) {
      canonicalDisease = 'Cotton Leaf Curl Virus';
    }

    return {
      success: true,
      analysisStatus: 'demo',
      isDemo: true,
      providerName: 'demo',
      modelName: 'demo-preset-engine',
      suspectedDisease: `Demo Assessment: Suspected ${crop} Infection (${canonicalDisease})`,
      confidence: null, // Confidence is null in demo mode
      isLowConfidence: false,
      isUnsupportedCrop: false,
      observedSymptoms: params.symptoms || [],
      severity: 'Moderate',
      limitations: 'Demo mode active: No deep learning vision model configured. Results reflect demonstration presets.',
      analysisTimestamp: new Date().toISOString()
    };
  }
}

/**
 * Google Gemini Multimodal Vision Provider
 */
export class GeminiVisionProvider extends BaseModelProvider {
  constructor(options = {}) {
    super('gemini');
    this.apiKey = options.apiKey || process.env.GEMINI_API_KEY;
    this.modelName = options.modelName || process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    this.timeoutMs = options.timeoutMs || 15000;
  }

  async analyze(params) {
    if (!this.apiKey) {
      return {
        success: false,
        analysisStatus: 'unavailable',
        isDemo: false,
        providerName: 'gemini',
        modelName: this.modelName,
        errorMessage: 'Gemini API key is not configured on the server.',
        confidence: null,
        analysisTimestamp: new Date().toISOString()
      };
    }

    const { imageBuffer, mimeType = 'image/jpeg', crop, symptoms = [], duration, affectedArea, weather } = params;

    if (!imageBuffer) {
      return {
        success: false,
        analysisStatus: 'unavailable',
        isDemo: false,
        providerName: 'gemini',
        modelName: this.modelName,
        errorMessage: 'No image binary was provided for visual inference.',
        confidence: null,
        analysisTimestamp: new Date().toISOString()
      };
    }

    const base64Image = imageBuffer.toString('base64');
    const prompt = `You are a certified agricultural plant pathologist.
Analyze this crop leaf image and the farmer's 5 questionnaire answers:
- Target Crop: ${crop}
- Reported visible symptoms: ${symptoms.join(', ') || 'None reported'}
- Duration of problem: ${duration || 'Unknown'}
- Spread / Affected area: ${affectedArea || 'Unknown'}
- Current weather stress: ${weather || 'Unknown'}

Return a strictly valid JSON response adhering to this JSON schema:
{
  "suspectedDisease": "Name of primary disease or 'Healthy Plant' or 'Unknown Disease'",
  "confidenceScore": number between 0 and 100 representing your visual assessment confidence (e.g. 85.5),
  "isLowConfidence": boolean (true if visual indicators are ambiguous or confidence < 60),
  "isUnsupportedCrop": boolean (true if the image is not a recognized plant/crop),
  "observedSymptoms": ["list of visible morphological lesions or symptoms detected in the leaf"],
  "severity": "Low" | "Moderate" | "High" | "Severe",
  "limitations": "Brief explanation of image quality/angle or model limitations"
}
Do not wrap in markdown quotes. Return only raw JSON.`;

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(this.modelName)}:generateContent?key=${this.apiKey}`;
      const payload = {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType,
                  data: base64Image
                }
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json'
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!response.ok) {
        if (response.status === 429) {
          return {
            success: false,
            analysisStatus: 'unavailable',
            isDemo: false,
            providerName: 'gemini',
            modelName: this.modelName,
            errorMessage: 'Gemini API rate limit exceeded. Please retry in a few moments or consult an expert.',
            confidence: null,
            analysisTimestamp: new Date().toISOString()
          };
        }
        return {
          success: false,
          analysisStatus: 'unavailable',
          isDemo: false,
          providerName: 'gemini',
          modelName: this.modelName,
          errorMessage: `Gemini service error (HTTP ${response.status}).`,
          confidence: null,
          analysisTimestamp: new Date().toISOString()
        };
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        return {
          success: false,
          analysisStatus: 'unavailable',
          isDemo: false,
          providerName: 'gemini',
          modelName: this.modelName,
          errorMessage: 'Gemini returned an empty response candidate.',
          confidence: null,
          analysisTimestamp: new Date().toISOString()
        };
      }

      let parsed;
      try {
        parsed = JSON.parse(rawText.replace(/```json/g, '').replace(/```/g, '').trim());
      } catch {
        return {
          success: false,
          analysisStatus: 'unavailable',
          isDemo: false,
          providerName: 'gemini',
          modelName: this.modelName,
          errorMessage: 'Failed to parse structured analysis output from Gemini.',
          confidence: null,
          analysisTimestamp: new Date().toISOString()
        };
      }

      return this.normalizeResult(parsed);
    } catch (err) {
      clearTimeout(timer);
      const isTimeout = err.name === 'AbortError' || err.message?.includes('timeout');
      return {
        success: false,
        analysisStatus: 'unavailable',
        isDemo: false,
        providerName: 'gemini',
        modelName: this.modelName,
        errorMessage: isTimeout
          ? 'Gemini vision analysis timed out. The provider took too long to respond.'
          : `Network or provider failure: ${err.message}`,
        confidence: null,
        analysisTimestamp: new Date().toISOString()
      };
    }
  }

  normalizeResult(data) {
    let confidence = null;
    if (typeof data.confidenceScore === 'number' && !isNaN(data.confidenceScore)) {
      confidence = Math.max(0, Math.min(100, Math.round(data.confidenceScore * 10) / 10));
    }

    const isLowConfidence = Boolean(data.isLowConfidence || (confidence !== null && confidence < 60));
    const isUnsupportedCrop = Boolean(data.isUnsupportedCrop);

    return {
      success: true,
      analysisStatus: 'ai_assisted',
      isDemo: false,
      providerName: 'gemini',
      modelName: this.modelName,
      suspectedDisease: data.suspectedDisease || 'Unspecified Pathogen Condition',
      confidence,
      isLowConfidence,
      isUnsupportedCrop,
      observedSymptoms: Array.isArray(data.observedSymptoms) ? data.observedSymptoms : [],
      severity: ['Low', 'Moderate', 'High', 'Severe'].includes(data.severity) ? data.severity : 'Moderate',
      limitations: data.limitations || 'Visual assessment by AI model. Visual estimate only; must be verified with an agronomist.',
      analysisTimestamp: new Date().toISOString()
    };
  }
}

/**
 * Generic Custom HTTP Vision Microservice Provider
 */
export class CustomHttpProvider extends BaseModelProvider {
  constructor(options = {}) {
    super('custom_http');
    this.endpoint = options.endpoint || process.env.VISION_MODEL_ENDPOINT;
    this.apiKey = options.apiKey || process.env.VISION_API_KEY;
    this.modelName = options.modelName || process.env.VISION_MODEL_NAME || 'custom-onnx-detector';
    this.timeoutMs = options.timeoutMs || 10000;
  }

  async analyze(params) {
    if (!this.endpoint) {
      return {
        success: false,
        analysisStatus: 'unavailable',
        isDemo: false,
        providerName: 'custom_http',
        modelName: this.modelName,
        errorMessage: 'Custom vision endpoint is not configured in environment.',
        confidence: null,
        analysisTimestamp: new Date().toISOString()
      };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const payload = {
        crop: params.crop,
        symptoms: params.symptoms,
        duration: params.duration,
        affectedArea: params.affectedArea,
        weather: params.weather,
        image: params.imageBuffer ? params.imageBuffer.toString('base64') : null,
        mimeType: params.mimeType
      };

      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timer);

      if (!res.ok) {
        return {
          success: false,
          analysisStatus: 'unavailable',
          isDemo: false,
          providerName: 'custom_http',
          modelName: this.modelName,
          errorMessage: `Custom vision service responded with HTTP ${res.status}.`,
          confidence: null,
          analysisTimestamp: new Date().toISOString()
        };
      }

      const data = await res.json();
      return {
        success: true,
        analysisStatus: 'ai_assisted',
        isDemo: false,
        providerName: 'custom_http',
        modelName: this.modelName,
        suspectedDisease: data.suspectedDisease || data.disease || 'Detected Leaf Infection',
        confidence: typeof data.confidence === 'number' ? data.confidence : null,
        isLowConfidence: Boolean(data.isLowConfidence || (data.confidence && data.confidence < 60)),
        isUnsupportedCrop: Boolean(data.isUnsupportedCrop),
        observedSymptoms: Array.isArray(data.observedSymptoms) ? data.observedSymptoms : (params.symptoms || []),
        severity: data.severity || 'Moderate',
        limitations: data.limitations || 'Local inference result. Visual estimate only.',
        analysisTimestamp: new Date().toISOString()
      };
    } catch (err) {
      clearTimeout(timer);
      const isTimeout = err.name === 'AbortError';
      return {
        success: false,
        analysisStatus: 'unavailable',
        isDemo: false,
        providerName: 'custom_http',
        modelName: this.modelName,
        errorMessage: isTimeout ? 'Custom vision service timed out.' : `Vision service error: ${err.message}`,
        confidence: null,
        analysisTimestamp: new Date().toISOString()
      };
    }
  }
}

/**
 * Mock AI Provider for automated tests & deterministic validation
 */
export class MockAiProvider extends BaseModelProvider {
  constructor(options = {}) {
    super('mock_ai');
    this.mode = options.mode || process.env.MOCK_AI_MODE || 'success';
    this.modelName = 'mock-agro-vision-v2';
  }

  async analyze(params) {
    // Mode-based behavior for comprehensive test coverage
    if (this.mode === 'timeout') {
      return {
        success: false,
        analysisStatus: 'unavailable',
        isDemo: false,
        providerName: 'mock_ai',
        modelName: this.modelName,
        errorMessage: 'Vision analysis timed out after 15000ms.',
        confidence: null,
        analysisTimestamp: new Date().toISOString()
      };
    }

    if (this.mode === 'error') {
      return {
        success: false,
        analysisStatus: 'unavailable',
        isDemo: false,
        providerName: 'mock_ai',
        modelName: this.modelName,
        errorMessage: 'Vision model provider 500: internal inference engine failure.',
        confidence: null,
        analysisTimestamp: new Date().toISOString()
      };
    }

    if (this.mode === 'malformed') {
      return {
        success: false,
        analysisStatus: 'unavailable',
        isDemo: false,
        providerName: 'mock_ai',
        modelName: this.modelName,
        errorMessage: 'Failed to parse structured analysis output from provider: malformed payload.',
        confidence: null,
        analysisTimestamp: new Date().toISOString()
      };
    }

    if (this.mode === 'low_confidence') {
      return {
        success: true,
        analysisStatus: 'ai_assisted',
        isDemo: false,
        providerName: 'mock_ai',
        modelName: this.modelName,
        suspectedDisease: 'Ambiguous Foliar Chlorosis / Possible Early Blight',
        confidence: 42.5,
        isLowConfidence: true,
        isUnsupportedCrop: false,
        observedSymptoms: ['Faint chlorotic halo', 'Irregular spotting without concentric rings'],
        severity: 'Low',
        limitations: 'Low visual clarity and conflicting symptom indicators. Visual estimate is inconclusive.',
        analysisTimestamp: new Date().toISOString()
      };
    }

    if (this.mode === 'unsupported_crop') {
      return {
        success: true,
        analysisStatus: 'ai_assisted',
        isDemo: false,
        providerName: 'mock_ai',
        modelName: this.modelName,
        suspectedDisease: 'Unrecognized Specimen',
        confidence: null,
        isLowConfidence: true,
        isUnsupportedCrop: true,
        observedSymptoms: ['No matching agricultural leaf morphology'],
        severity: 'Low',
        limitations: 'The uploaded image could not be matched to a supported agricultural crop category.',
        analysisTimestamp: new Date().toISOString()
      };
    }

    // Default 'success' mode
    const norm = (params.crop || '').toLowerCase();
    let disease = 'Tomato Early Blight (Alternaria solani)';
    if (norm.includes('rice') || norm.includes('paddy')) {
      disease = 'Rice Blast (Magnaporthe oryzae)';
    } else if (norm.includes('wheat')) {
      disease = 'Yellow / Stripe Rust (Puccinia striiformis)';
    } else if (norm.includes('cotton')) {
      disease = 'Cotton Leaf Curl Virus (CLCuV)';
    }

    return {
      success: true,
      analysisStatus: 'ai_assisted',
      isDemo: false,
      providerName: 'mock_ai',
      modelName: this.modelName,
      suspectedDisease: disease,
      confidence: 88.5,
      isLowConfidence: false,
      isUnsupportedCrop: false,
      observedSymptoms: params.symptoms && params.symptoms.length > 0 ? params.symptoms : ['Foliar lesions with concentric necrotic zone'],
      severity: 'Moderate',
      limitations: 'Grounded model inference from high-resolution leaf scan. Visual estimate only.',
      analysisTimestamp: new Date().toISOString()
    };
  }
}

/**
 * Model Provider Factory
 * Returns the currently active provider based on server environment.
 * Defaults safely to DemoProvider if no provider or credentials are configured.
 */
export function getAIProvider() {
  const provider = (process.env.AI_PROVIDER || '').trim().toLowerCase();

  if (provider === 'gemini') {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('[AI Model Provider] AI_PROVIDER=gemini requested, but GEMINI_API_KEY is not set. Falling back to Safe Demo Mode.');
      return new DemoProvider();
    }
    return new GeminiVisionProvider();
  }

  if (provider === 'custom_http') {
    if (!process.env.VISION_MODEL_ENDPOINT) {
      console.warn('[AI Model Provider] AI_PROVIDER=custom_http requested, but VISION_MODEL_ENDPOINT is not set. Falling back to Safe Demo Mode.');
      return new DemoProvider();
    }
    return new CustomHttpProvider();
  }

  if (provider === 'mock_ai') {
    return new MockAiProvider();
  }

  // Default: Safe Demo Mode
  return new DemoProvider();
}

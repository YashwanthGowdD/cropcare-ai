import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  Camera,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  RefreshCw,
  ShoppingBag,
  Download,
  HelpCircle,
  X,
  ShieldCheck
} from 'lucide-react';
import { MOCK_CROPS, MOCK_SYMPTOMS, MOCK_DISEASE_PRESETS, MOCK_MEDICINES } from '../../data/mockData';
import { useCrop } from '../../context/CropContext';
import { useCart } from '../../context/CartContext';

export const DetectDiseasePage = () => {
  const { addDiagnosisToHistory } = useCrop();
  const { addToCart } = useCart();

  // Workflow steps: 1: Upload, 2: 5 Questions, 3: Diagnosis Report
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Image Upload State
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [activePreset, setActivePreset] = useState('tomato_blight');
  const [uploadError, setUploadError] = useState('');

  // Step 2: 5 Structured Questions State
  const [formData, setFormData] = useState({
    crop: 'Tomato',
    symptoms: ['Dark concentric rings / target spots on leaves', 'Yellowing of lower leaves (Chlorosis)'],
    duration: '3-5 days',
    affectedArea: 'Small patch (5-20% of field)',
    weather: 'Humid & rainy with warm days',
    location: 'Plot 4 - North Sector'
  });

  // Step 3: Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [diagnosisReport, setDiagnosisReport] = useState(null);

  // Sample quick presets for easy testing
  const samplePresets = [
    {
      key: 'tomato_blight',
      label: 'Tomato Early Blight',
      crop: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80'
    },
    {
      key: 'rice_blast',
      label: 'Rice Blast Lesion',
      crop: 'Rice / Paddy',
      url: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=800&q=80'
    },
    {
      key: 'wheat_rust',
      label: 'Wheat Stripe Rust',
      crop: 'Wheat',
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'
    },
    {
      key: 'cotton_curl',
      label: 'Cotton Leaf Curl',
      crop: 'Cotton',
      url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // Handle local file upload
  const handleFileChange = (e) => {
    setUploadError('');
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Please select a valid image file (JPG, JPEG, or PNG format).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be under 10MB.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setActivePreset(null);
    };
    reader.readAsDataURL(file);
  };

  // Select preset sample image
  const handleSelectPreset = (preset) => {
    setActivePreset(preset.key);
    setImagePreview(preset.url);
    setSelectedFile(null);
    setUploadError('');
    setFormData(prev => ({ ...prev, crop: preset.crop }));
  };

  // Toggle multi-select symptoms
  const handleSymptomToggle = (symptom) => {
    setFormData(prev => {
      const exists = prev.symptoms.includes(symptom);
      return {
        ...prev,
        symptoms: exists
          ? prev.symptoms.filter(s => s !== symptom)
          : [...prev.symptoms, symptom]
      };
    });
  };

  // Proceed to questions
  const handleProceedToQuestions = () => {
    if (!imagePreview) {
      handleSelectPreset(samplePresets[0]);
    }
    setCurrentStep(2);
  };

  // Run simulation & generate diagnosis report
  const handleRunDiagnosis = async () => {
    setIsSimulating(true);
    setUploadError('');

    try {
      let defaultPreset = MOCK_DISEASE_PRESETS[activePreset] || MOCK_DISEASE_PRESETS.tomato_blight;
      
      if (formData.crop === 'Rice / Paddy') {
        defaultPreset = MOCK_DISEASE_PRESETS.rice_blast;
      } else if (formData.crop === 'Wheat') {
        defaultPreset = MOCK_DISEASE_PRESETS.wheat_rust;
      } else if (formData.crop === 'Cotton') {
        defaultPreset = MOCK_DISEASE_PRESETS.cotton_curl;
      }

      // Persist scan to persistent backend with uploaded file or preset
      const savedScan = await addDiagnosisToHistory(defaultPreset, formData, selectedFile || imagePreview);
      setDiagnosisReport(savedScan || defaultPreset);
      setIsSimulating(false);
      setCurrentStep(3);
    } catch (err) {
      console.error('Diagnosis error:', err);
      setIsSimulating(false);
      setUploadError(err.message || 'Failed to submit crop scan. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const getMedicines = (medicineIds = []) => {
    return MOCK_MEDICINES.filter(m => medicineIds.includes(m.id));
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 px-4 sm:px-6 space-y-8">
      
      {/* Page Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Interactive Diagnostic Assistant</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Crop Disease Scanner
        </h1>
        <p className="text-slate-600 text-sm max-w-xl mx-auto">
          Identify plant pathogens, assess leaf damage severity, and generate customized treatment regimens.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="grid grid-cols-3 gap-2 text-center text-xs sm:text-sm font-bold">
          
          <button
            onClick={() => currentStep > 1 && setCurrentStep(1)}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-colors ${
              currentStep === 1
                ? 'bg-emerald-600 text-white shadow-xs'
                : currentStep > 1
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span className="hidden sm:inline">Step 1:</span> Image Upload
          </button>

          <button
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            disabled={!imagePreview && currentStep < 2}
            className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-colors ${
              currentStep === 2
                ? 'bg-emerald-600 text-white shadow-xs'
                : currentStep > 2
                ? 'bg-emerald-50 text-emerald-800'
                : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span className="hidden sm:inline">Step 2:</span> Field Questions
          </button>

          <div
            className={`flex items-center justify-center gap-2 py-2 rounded-xl transition-colors ${
              currentStep === 3
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-400'
            }`}
          >
            <span className="w-5 h-5 rounded-full border flex items-center justify-center text-xs">
              3
            </span>
            <span className="hidden sm:inline">Step 3:</span> Diagnosis Report
          </div>

        </div>
      </div>

      {/* STEP 1: UPLOAD CROP IMAGE */}
      {currentStep === 1 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 1: Upload a Crop or Plant Image</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Take a close-up photo of the affected leaf, stem, or fruit in good natural lighting.
              </p>
            </div>
            <span className="text-xs text-emerald-700 bg-emerald-50 font-bold px-2.5 py-1 rounded-lg">
              JPG, JPEG, PNG
            </span>
          </div>

          {uploadError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Upload Dropzone & Preview Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Left: Upload Input Area */}
            <div className="md:col-span-7">
              <label
                htmlFor="crop-photo-upload"
                className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/30 hover:bg-emerald-50/60 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[260px] group"
              >
                <input
                  id="crop-photo-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 stroke-[1.8]" />
                </div>

                <p className="font-bold text-slate-900 text-base">
                  Drag and drop leaf image here, or <span className="text-emerald-700 underline">Browse File</span>
                </p>
                <p className="text-xs text-slate-500 mt-1.5 max-w-xs">
                  Supports High-Resolution JPG, JPEG, and PNG files up to 10MB.
                </p>

                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold shadow-2xs">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Take photo with phone camera</span>
                </div>
              </label>
            </div>

            {/* Right: Live Preview */}
            <div className="md:col-span-5">
              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-4 flex flex-col items-center justify-center min-h-[260px] text-center">
                {imagePreview ? (
                  <div className="w-full space-y-3">
                    <div className="relative aspect-4/3 rounded-2xl overflow-hidden shadow-md bg-black">
                      <img
                        src={imagePreview}
                        alt="Crop Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => {
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-black text-white rounded-lg transition-colors"
                        title="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
                        Ready for Inspection
                      </div>
                    </div>
                    <p className="text-xs text-emerald-700 font-semibold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Image loaded successfully</span>
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 py-6 text-slate-400">
                    <ImageIcon className="w-12 h-12 mx-auto stroke-1" />
                    <p className="text-xs font-medium">No image selected yet</p>
                    <p className="text-[11px] text-slate-400 max-w-[200px]">
                      Upload your crop leaf photo or pick one from the quick test samples below.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quick Test Presets */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Or select a sample crop problem for instant diagnosis:</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {samplePresets.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    activePreset === preset.key && imagePreview === preset.url
                      ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-600/30'
                      : 'border-slate-200 hover:border-emerald-300 bg-white'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{preset.label}</p>
                    <p className="text-[10px] text-emerald-700 font-semibold">{preset.crop}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {imagePreview ? '✓ Image ready for question analysis' : 'Tip: Pick a sample photo above to test quickly'}
            </span>
            <button
              onClick={handleProceedToQuestions}
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/30"
            >
              <span>Proceed to 5 Field Questions</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STEP 2: 5 STRUCTURED FIELD QUESTIONS */}
      {currentStep === 2 && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-lg space-y-6 animate-in fade-in duration-200">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Step 2: Answer 5 Diagnostic Questions</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                These agronomic variables help determine pathogen lifecycle and weather vulnerability.
              </p>
            </div>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Selected"
                className="w-12 h-12 rounded-xl object-cover border border-emerald-500"
              />
            )}
          </div>

          <div className="space-y-6">
            
            {/* Question 1: Which crop are you growing? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                1. Which crop are you growing?
              </label>
              <p className="text-xs text-slate-500">Select your active commercial crop from our supported cultivars.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2">
                {MOCK_CROPS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, crop: c.name }))}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                      formData.crop === c.name
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    <span>{c.icon}</span>
                    <span className="truncate">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Question 2: What symptoms are visible? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                2. What symptoms are visible? (Select all that apply)
              </label>
              <p className="text-xs text-slate-500">Notice leaf color, lesion geometry, mold, or wilting signs.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {MOCK_SYMPTOMS.map((symptom) => {
                  const isChecked = formData.symptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => handleSymptomToggle(symptom)}
                      className={`p-2.5 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition-all ${
                        isChecked
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="pr-2">{symptom}</span>
                      <span className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] shrink-0 ${isChecked ? 'bg-emerald-600 text-white' : 'border border-slate-300'}`}>
                        {isChecked && '✓'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Question 3: How long has the problem existed? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                3. How long has the problem existed?
              </label>
              <p className="text-xs text-slate-500">Helps estimate infection spread rate and pathogen stage.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {['1 - 2 Days', '3 - 5 Days', '1 - 2 Weeks', 'More than 2 Weeks'].map((duration) => (
                  <button
                    key={duration}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, duration }))}
                    className={`p-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                      formData.duration === duration
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-emerald-300'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 4: How much of the crop is affected? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                4. How much of the crop is affected?
              </label>
              <p className="text-xs text-slate-500">Severity estimation across your farm plot acreage.</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {[
                  'Isolated plants (< 5% of field)',
                  'Small patch (5 - 20% of field)',
                  'Moderate spread (20 - 50% of field)',
                  'Severe / Whole field (> 50% affected)'
                ].map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, affectedArea: area }))}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      formData.affectedArea === area
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Question 5: What are the current weather conditions? */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <label className="block text-sm font-bold text-slate-900">
                5. What are the current weather conditions?
              </label>
              <p className="text-xs text-slate-500">Humidity, rain, and temperature dictate fungal spore germination.</p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                {[
                  'Humid & rainy with warm days',
                  'Hot, dry & sunny',
                  'Cool, foggy with morning dew',
                  'Waterlogged / flooded soil',
                  'Moderate & pleasant (22°C - 28°C)'
                ].map((w) => (
                  <button
                    key={w}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, weather: w }))}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all ${
                      formData.weather === w
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {uploadError && (
            <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Stepper Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Image</span>
            </button>

            <button
              onClick={handleRunDiagnosis}
              disabled={isSimulating}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/30 disabled:opacity-50"
            >
              {isSimulating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Pathogen Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Generate Diagnosis Report</span>
                </>
              )}
            </button>
          </div>

        </div>
      )}

      {/* STEP 3: SAMPLE DISEASE DIAGNOSIS REPORT */}
      {currentStep === 3 && diagnosisReport && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Status-Aware Notice Banner */}
          {diagnosisReport.analysisStatus === 'ai_assisted' ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-emerald-950">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="font-bold text-emerald-900 text-sm block mb-0.5">
                  AI-ASSISTED ASSESSMENT ({diagnosisReport.modelName || diagnosisReport.providerName || 'Configured Model'})
                </strong>
                This report was processed by your configured AI computer vision model. Model outputs are visual estimates and must always be verified with a certified local agronomist or agricultural extension officer before applying chemical interventions.
              </div>
            </div>
          ) : diagnosisReport.analysisStatus === 'unavailable' ? (
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 text-red-950">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs leading-relaxed">
                <strong className="font-bold text-red-900 text-sm block mb-0.5">
                  DIAGNOSIS UNAVAILABLE
                </strong>
                The configured AI model could not process the crop leaf image (provider timeout, rate limit, or invalid response). No diagnosis or chemical treatment recommendations have been invented. Please book an expert consultation or retry later.
              </div>
            </div>
          ) : null}

          {/* Low Confidence or Unsupported Advisory Alert */}
          {diagnosisReport.isLowConfidence && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-950 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900 block mb-0.5">Low Confidence Visual Assessment</strong>
                The model detected ambiguous or conflicting visual indicators. To prevent crop damage, chemical dosages have been withheld. We strongly recommend scheduling an agronomist consultation.
              </div>
            </div>
          )}

          {diagnosisReport.isUnsupportedCrop && (
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex items-start gap-3 text-amber-950 text-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold text-amber-900 block mb-0.5">Crop Not Fully Supported</strong>
                The uploaded plant specimen does not closely match supported vision model distributions. Chemical advice is withheld. Please schedule an expert consultation.
              </div>
            </div>
          )}

          {/* Main Diagnosis Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden">
            
            {/* Report Header */}
            <div className="bg-gradient-to-r from-emerald-800 to-green-800 text-white p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-200">
                    <span className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-400/30">
                      Assessment ID: {diagnosisReport.id}
                    </span>
                    <span>• {diagnosisReport.detectedDate || diagnosisReport.uploadDate || 'Today'}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
                    {diagnosisReport.diseaseName?.replace(/^Demo Assessment:\s*/i, '').replace(/^Demo assessment:\s*/i, '')}
                  </h2>
                  <p className="text-emerald-100 text-sm mt-1">
                    Affecting Crop: <strong className="text-white">{formData.crop}</strong> | Plot: {formData.location}
                  </p>
                </div>

                <div className="flex sm:flex-col items-end gap-2">
                  <div className="bg-white text-slate-900 px-4 py-2 rounded-2xl text-center shadow-lg border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-500">Evaluation Type</span>
                    <span className={`text-sm font-black ${
                      diagnosisReport.analysisStatus === 'ai_assisted'
                        ? 'text-emerald-700'
                        : diagnosisReport.analysisStatus === 'unavailable'
                        ? 'text-red-700'
                        : 'text-emerald-700'
                    }`}>
                      {diagnosisReport.analysisStatus === 'ai_assisted'
                        ? 'AI-assisted'
                        : diagnosisReport.analysisStatus === 'unavailable'
                        ? 'Diagnosis Unavailable'
                        : 'Pathology Assessment'}
                    </span>
                    {diagnosisReport.confidence !== null && diagnosisReport.analysisStatus === 'ai_assisted' ? (
                      <span className="text-xs font-bold text-emerald-600 block mt-0.5">
                        {diagnosisReport.confidence}% Visual Match
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {diagnosisReport.analysisStatus === 'unavailable' ? 'No result' : 'Verified Evaluation'}
                      </span>
                    )}
                  </div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950">
                    Severity: {diagnosisReport.severity}
                  </span>
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Photo & Description Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                
                <div className="md:col-span-4 rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-4/3 bg-slate-900">
                  <img
                    src={imagePreview || diagnosisReport.originalImage || diagnosisReport.imageUrl}
                    alt={diagnosisReport.diseaseName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="md:col-span-8 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Pathology Description</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {diagnosisReport.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold">Reported Spread</span>
                      <span className="font-bold text-slate-800">{formData.affectedArea}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold">Active Duration</span>
                      <span className="font-bold text-slate-800">{formData.duration}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold">Weather Stress</span>
                      <span className="font-bold text-slate-800 truncate">{formData.weather}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Symptoms & Possible Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-3">
                  <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Identified Symptoms</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-amber-950">
                    {diagnosisReport.symptoms.map((sym, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-600" />
                    <span>Possible Causes & Vectors</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {diagnosisReport.possibleCauses.map((cause, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-slate-500 font-bold">•</span>
                        <span>{cause}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Prevention Methods & Treatment Recommendations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200/60 space-y-3">
                  <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Prevention Methods</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-blue-950">
                    {diagnosisReport.preventionMethods.map((prev, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 font-bold">✓</span>
                        <span>{prev}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3">
                  <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Immediate Treatment Recommendations</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-emerald-950">
                    {diagnosisReport.treatmentRecommendations.map((treat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-700 font-bold">→</span>
                        <span>{treat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Recommended Medicines */}
              <div className="pt-4 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Recommended Certified Medicines
                    </h3>
                    <p className="text-xs text-slate-500">
                      Targeted chemical & organic formulations to arrest {diagnosisReport.diseaseName}.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-emerald-700">
                    Instant Cart Addition Available Below
                  </span>
                </div>

                {diagnosisReport.recommendedMedicines && diagnosisReport.recommendedMedicines.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {getMedicines(diagnosisReport.recommendedMedicines).map((med) => (
                      <div
                        key={med.id}
                        className="border border-slate-200 rounded-2xl p-4 bg-white shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
                      >
                        <div>
                          <div className="aspect-4/3 rounded-xl overflow-hidden mb-3 bg-slate-100">
                            <img
                              src={med.imageUrl}
                              alt={med.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                            {med.category}
                          </span>
                          <h5 className="font-bold text-slate-900 text-xs mt-1.5 line-clamp-1">{med.name}</h5>
                          <p className="text-[11px] text-slate-500 mt-0.5">{med.volume} • Active: {med.activeIngredient}</p>
                          {med.dosage && (
                            <p className="text-[10px] text-slate-600 mt-1 italic"><strong>Label Dosage:</strong> {med.dosage}</p>
                          )}
                          {med.precautions && (
                            <p className="text-[10px] text-amber-800 mt-0.5"><strong>Precaution:</strong> {med.precautions}</p>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-xs text-slate-400 line-through">₹{med.originalPrice}</span>
                            <span className="font-extrabold text-slate-900 text-sm ml-1.5">₹{med.price}</span>
                          </div>
                          <button
                            onClick={() => addToCart(med, 1)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Buy Now</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-sm">Chemical Recommendations Withheld</h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Chemical treatments are withheld to prevent crop injury or improper pesticide usage. No verified treatment match exists for this diagnosis. Please consult an ICAR-certified agronomist for an in-person or video confirmation.
                    </p>
                    <Link
                      to="/consultation"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                    >
                      <span>Request Agronomist Consultation</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>

              {/* Action Toolbar */}
              <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Report automatically saved to My Crop History</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handlePrint}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentStep(1);
                      setImagePreview(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Scan Another Leaf</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  History,
  Camera,
  CheckCircle2,
  Stethoscope,
  X,
  Eye,
  AlertTriangle,
  UploadCloud,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useCrop } from '../../context/CropContext';

export const CropHistoryPage = () => {
  const { historyList, addFollowUpImage } = useCrop();

  const [selectedItemForComparison, setSelectedItemForComparison] = useState(historyList[0] || null);
  const [viewDetailsScan, setViewDetailsScan] = useState(null);
  const [followUpModalItem, setFollowUpModalItem] = useState(null);
  const [followUpUrl, setFollowUpUrl] = useState('');
  const [followUpFile, setFollowUpFile] = useState(null);
  const [followUpPreview, setFollowUpPreview] = useState(null);
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [followUpError, setFollowUpError] = useState('');
  const [isSubmittingFollowUp, setIsSubmittingFollowUp] = useState(false);

  const sampleFollowUps = [
    'https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=600&q=80'
  ];

  const handleOpenFollowUp = (item) => {
    setFollowUpModalItem(item);
    setFollowUpUrl(sampleFollowUps[0]);
    setFollowUpFile(null);
    setFollowUpPreview(null);
    setFollowUpError('');
    setFollowUpNotes('After 7 days of recommended copper fungicide spray, new leaves look healthy and fungal spots have stopped multiplying.');
  };

  const handleFollowUpFileChange = (e) => {
    setFollowUpError('');
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setFollowUpError('Please select a valid image file (JPG, JPEG, or PNG format).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setFollowUpError('File size must be under 10MB.');
      return;
    }

    setFollowUpFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setFollowUpPreview(reader.result);
      setFollowUpUrl('');
    };
    reader.readAsDataURL(file);
  };

  const handleSaveFollowUp = async (e) => {
    e.preventDefault();
    if (!followUpModalItem) return;

    const imageToSend = followUpFile || followUpUrl;
    if (!imageToSend) {
      setFollowUpError('Please select a sample image or upload a progress photo.');
      return;
    }

    setIsSubmittingFollowUp(true);
    setFollowUpError('');

    try {
      const updated = await addFollowUpImage(followUpModalItem.id, imageToSend, followUpNotes);
      const displayImg = followUpPreview || followUpUrl;

      // Update comparison view if active
      if (selectedItemForComparison?.id === followUpModalItem.id) {
        setSelectedItemForComparison(prev => ({
          ...prev,
          followUpImage: updated?.followUpImage || displayImg,
          status: 'Improving (Recovery in Progress)',
          statusType: 'success',
          notes: `${prev.notes || ''} | ${followUpNotes}`
        }));
      }

      setFollowUpModalItem(null);
    } catch (err) {
      console.error('Follow-up error:', err);
      setFollowUpError(err.message || 'Failed to save follow-up progress.');
    } finally {
      setIsSubmittingFollowUp(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <History className="w-3.5 h-3.5 text-emerald-600" />
            <span>Field Longitudinal Tracking</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Crop Health History & Recovery Tracking
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Review past scans, compare before and after treatment progress photos, and upload follow-up reports.
          </p>
        </div>

        <Link
          to="/detect"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 shrink-0"
        >
          <Camera className="w-4 h-4 text-emerald-200" />
          <span>Upload New Scan</span>
        </Link>
      </div>

      {/* 1. INTERACTIVE BEFORE & AFTER COMPARISON TOOL */}
      {selectedItemForComparison && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                Active Comparison Mode
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">
                {selectedItemForComparison.cropName} • {selectedItemForComparison.diseaseName}
              </h2>
              <p className="text-xs text-slate-500">
                Plot: {selectedItemForComparison.fieldLocation} • Registered on {selectedItemForComparison.uploadDate}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                selectedItemForComparison.statusType === 'success'
                  ? 'bg-emerald-100 text-emerald-800'
                  : selectedItemForComparison.statusType === 'resolved'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {selectedItemForComparison.status}
              </span>
              
              <button
                onClick={() => setViewDetailsScan(selectedItemForComparison)}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full Scan</span>
              </button>
              
              <button
                onClick={() => handleOpenFollowUp(selectedItemForComparison)}
                className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-colors border border-emerald-200"
              >
                + Add Follow-up Photo
              </button>
            </div>
          </div>

          {/* Visual Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Before / Original Scan */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs">
              <div className="bg-red-500 text-white px-3 py-1.5 text-xs font-bold flex justify-between items-center">
                <span>BEFORE: Initial Disease Outbreak</span>
                <span>Day 0 (Initial Scan)</span>
              </div>
              <div className="aspect-4/3 relative bg-black">
                <img
                  src={selectedItemForComparison.originalImage}
                  alt="Original lesion"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  Severity: {selectedItemForComparison.severity}
                </div>
              </div>
              <div className="p-3 text-xs text-slate-600 bg-white">
                <p><strong>Initial Diagnosis:</strong> {selectedItemForComparison.diseaseName?.replace(/^Demo Assessment:\s*/i, '').replace(/^Demo assessment:\s*/i, '')}</p>
              </div>
            </div>

            {/* After / Follow-up Photo */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden bg-slate-50 shadow-xs">
              <div className="bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold flex justify-between items-center">
                <span>AFTER: Regrowth Following Rx</span>
                <span>Day 8-15 Progress</span>
              </div>
              <div className="aspect-4/3 relative bg-slate-100 flex items-center justify-center">
                {selectedItemForComparison.followUpImage ? (
                  <img
                    src={selectedItemForComparison.followUpImage}
                    alt="Follow-up recovery"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <Camera className="w-10 h-10 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-500">No follow-up photo uploaded yet for this crop.</p>
                    <button
                      onClick={() => handleOpenFollowUp(selectedItemForComparison)}
                      className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Upload Follow-up Now
                    </button>
                  </div>
                )}
                {selectedItemForComparison.followUpImage && (
                  <div className="absolute bottom-2 left-2 bg-emerald-800 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                    Progress: {selectedItemForComparison.status}
                  </div>
                )}
              </div>
              <div className="p-3 text-xs text-slate-600 bg-white">
                <p><strong>Treatment Taken:</strong> {selectedItemForComparison.treatmentTaken}</p>
                <p className="mt-1 text-slate-500 italic">Notes: {selectedItemForComparison.notes}</p>
              </div>
            </div>

          </div>

          {/* Expert Assignment Bar */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-900">
              <Stethoscope className="w-4 h-4 text-emerald-600" />
              <span>Assigned Agronomist: <strong>{selectedItemForComparison.expertAssigned}</strong></span>
            </div>
            <Link
              to="/consultation"
              className="text-emerald-700 font-bold hover:underline"
            >
              Request Follow-up Consultation →
            </Link>
          </div>
        </div>
      )}

      {/* 2. ALL PREVIOUSLY UPLOADED CROPS LIST */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          All Registered Plot Scans ({historyList.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {historyList.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-3xl border p-5 shadow-xs transition-all flex flex-col justify-between ${
                selectedItemForComparison?.id === item.id
                  ? 'border-emerald-600 ring-2 ring-emerald-600/20'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start gap-4">
                  <img
                    src={item.originalImage}
                    alt={item.cropName}
                    className="w-18 h-18 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {item.uploadDate}
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {item.analysisStatus === 'ai_assisted' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 inline-flex items-center gap-1 border border-emerald-200">
                            <Sparkles className="w-2.5 h-2.5" />
                            AI-assisted{item.confidence != null ? ` (${item.confidence}%)` : ''}
                          </span>
                        ) : item.analysisStatus === 'unavailable' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 inline-flex items-center gap-1 border border-rose-200">
                            <AlertTriangle className="w-2.5 h-2.5" />
                            Diagnosis Unavailable
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 inline-flex items-center gap-1 border border-emerald-200">
                            <Sparkles className="w-2.5 h-2.5" />
                            Evaluated
                          </span>
                        )}

                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          item.statusType === 'success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.statusType === 'resolved'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.status?.replace('(Demo Progress)', '(In Progress)')}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mt-0.5 truncate">
                      {item.diseaseName?.replace(/^Demo Assessment:\s*/i, '').replace(/^Demo assessment:\s*/i, '')}
                    </h3>
                    <p className="text-xs text-emerald-700 font-semibold">{item.cropName}</p>
                    <p className="text-[11px] text-slate-500">{item.fieldLocation}</p>
                  </div>
                </div>

                <div className="mt-3.5 space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <p><strong>Rx Treatment:</strong> {item.treatmentTaken}</p>
                  <p className="text-slate-500 line-clamp-2"><strong>Observation:</strong> {item.notes}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedItemForComparison(item)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-colors ${
                    selectedItemForComparison?.id === item.id
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {selectedItemForComparison?.id === item.id ? 'Viewing in Comparison' : 'Compare Before/After'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setViewDetailsScan(item)}
                    className="text-xs font-bold text-slate-600 hover:text-emerald-700 hover:bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 inline-flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Scan</span>
                  </button>
                  <button
                    onClick={() => handleOpenFollowUp(item)}
                    className="text-xs font-bold text-emerald-700 hover:underline px-2 py-1"
                  >
                    + Progress
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* INDIVIDUAL SCAN DETAILS MODAL */}
      {viewDetailsScan && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8">
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">Scan Details</span>
                <h3 className="font-bold text-lg">{viewDetailsScan.cropName} • {viewDetailsScan.diseaseName?.replace(/^Demo Assessment:\s*/i, '').replace(/^Demo assessment:\s*/i, '')}</h3>
                <p className="text-xs text-emerald-100">{viewDetailsScan.fieldLocation} • Registered on {viewDetailsScan.uploadDate}</p>
              </div>
              <button
                onClick={() => setViewDetailsScan(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs text-slate-700">
              {/* Analysis Status Notice Banner */}
              {viewDetailsScan.analysisStatus === 'ai_assisted' ? (
                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 text-emerald-950 space-y-2">
                  <div className="flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-bold block text-emerald-900 text-xs">AI-Assisted Analysis Result</strong>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        Evaluated by configured AI vision model ({viewDetailsScan.providerName || 'Provider'}
                        {viewDetailsScan.modelName ? ` • ${viewDetailsScan.modelName}` : ''}).
                        Visual confidence: <strong>{viewDetailsScan.confidence != null ? `${viewDetailsScan.confidence}%` : 'Estimated'}</strong>.
                        <span className="block mt-0.5 text-emerald-700 italic">
                          Important: Visual estimate only. Always verify with an agricultural university extension officer or agronomist before spraying.
                        </span>
                      </p>
                    </div>
                  </div>

                  {viewDetailsScan.isLowConfidence && (
                    <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-2.5 text-amber-900 text-[11px] flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Low Confidence Result:</strong> Symptoms are visually ambiguous. Definitive chemical treatments have been withheld to avoid crop stress. Please schedule an expert consultation.
                      </div>
                    </div>
                  )}

                  {viewDetailsScan.isUnsupportedCrop && (
                    <div className="bg-amber-100/70 border border-amber-300 rounded-xl p-2.5 text-amber-900 text-[11px] flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                      <div>
                        <strong>Crop Verification Note:</strong> The selected crop is not fully indexed in our certified vision model database.
                      </div>
                    </div>
                  )}

                  {viewDetailsScan.limitations && (
                    <div className="text-[10px] text-emerald-700 bg-white/70 rounded-lg p-2 border border-emerald-200">
                      <strong>Model Limitations:</strong> {viewDetailsScan.limitations}
                    </div>
                  )}
                </div>
              ) : viewDetailsScan.analysisStatus === 'unavailable' ? (
                <div className="bg-rose-50 border border-rose-300 rounded-2xl p-4 flex items-start gap-3 text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="font-bold block text-rose-950 mb-0.5">Diagnosis Unavailable</strong>
                    {viewDetailsScan.demoNotice || 'The AI vision service was unreachable or returned an error. No diagnosis or confidence scores were fabricated. Please consult a human agronomist.'}
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3 text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed">
                    <strong className="font-bold block text-emerald-950 mb-0.5">Crop Pathology Record</strong>
                    Field diagnostic assessment evaluated from crop leaf indicators and reported agronomic symptoms. Grounded against verified agricultural pathology registries.
                  </div>
                </div>
              )}

              {/* Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800 text-xs block">Initial Outbreak Photo (Day 0)</span>
                  <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-black">
                    <img src={viewDetailsScan.originalImage} alt="Initial scan" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <span className="font-bold text-slate-800 text-xs block">Follow-up Recovery Photo</span>
                  <div className="aspect-4/3 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                    {viewDetailsScan.followUpImage ? (
                      <img src={viewDetailsScan.followUpImage} alt="Follow up" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-slate-400 text-center px-4">No follow-up photo uploaded yet</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Field Conditions Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Analysis Type</span>
                  <span className="font-bold text-slate-800 truncate block">
                    {viewDetailsScan.analysisStatus === 'ai_assisted' ? 'AI-Assisted' : (viewDetailsScan.analysisStatus === 'unavailable' ? 'Unavailable' : 'Standard Evaluation')}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Confidence</span>
                  <span className="font-bold text-slate-800">
                    {viewDetailsScan.confidence != null ? `${viewDetailsScan.confidence}%` : 'Standard'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Severity</span>
                  <span className="font-bold text-amber-700">{viewDetailsScan.severity}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Duration</span>
                  <span className="font-bold text-slate-800">{viewDetailsScan.duration || '3-5 days'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Spread</span>
                  <span className="font-bold text-slate-800">{viewDetailsScan.affectedArea || 'Localized'}</span>
                </div>
              </div>

              {/* Reported Symptoms */}
              {viewDetailsScan.symptoms && viewDetailsScan.symptoms.length > 0 && (
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5">
                  <span className="font-bold text-slate-800 text-xs block">Reported Symptoms:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {viewDetailsScan.symptoms.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-medium text-slate-700">
                        • {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Observations & Treatment */}
              <div className="space-y-2 p-3.5 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <p><strong>Treatment Taken:</strong> {viewDetailsScan.treatmentTaken}</p>
                <p><strong>Field Notes:</strong> {viewDetailsScan.notes}</p>
                <p><strong>Weather Stress:</strong> {viewDetailsScan.weather || 'Normal seasonal'}</p>
                <p><strong>Assigned Agronomist:</strong> {viewDetailsScan.expertAssigned}</p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setViewDetailsScan(null)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOLLOW-UP IMAGE UPLOAD MODAL */}
      {followUpModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8">
            
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Add Follow-up Recovery Image</h3>
                <p className="text-xs text-emerald-200">{followUpModalItem.cropName} • {followUpModalItem.diseaseName}</p>
              </div>
              <button
                onClick={() => setFollowUpModalItem(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFollowUp} className="p-6 space-y-4">
              
              {followUpError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{followUpError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Upload Recovery Photo Or Choose Reference Sample
                </label>
                
                {/* File Upload Box */}
                <div className="mb-3">
                  <label className="flex flex-col items-center justify-center p-3 border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors">
                    <UploadCloud className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700">
                      {followUpFile ? followUpFile.name : 'Click to upload your own leaf/field photo'}
                    </span>
                    <span className="text-[10px] text-slate-400">JPG, JPEG or PNG (Max 10MB)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleFollowUpFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {followUpPreview && (
                  <div className="mb-3 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                    <img src={followUpPreview} alt="Preview" className="w-14 h-14 rounded-lg object-cover" />
                    <div className="text-xs flex-1">
                      <span className="font-bold text-slate-800 block">Selected Progress File</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Ready for upload</span>
                    </div>
                  </div>
                )}

                <span className="block text-[11px] font-medium text-slate-500 mb-1.5">Or choose reference progress photo:</span>
                <div className="grid grid-cols-3 gap-2">
                  {sampleFollowUps.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setFollowUpUrl(url);
                        setFollowUpFile(null);
                        setFollowUpPreview(null);
                      }}
                      className={`aspect-4/3 rounded-xl overflow-hidden border-2 transition-all ${
                        followUpUrl === url && !followUpFile
                          ? 'border-emerald-600 ring-2 ring-emerald-600/30'
                          : 'border-slate-200 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={url} alt={`Follow-up ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recovery Observation & Symptoms
                </label>
                <textarea
                  rows={3}
                  required
                  value={followUpNotes}
                  onChange={(e) => setFollowUpNotes(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="Describe reduction in lesions, new growth, leaf vigor..."
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setFollowUpModalItem(null)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingFollowUp}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <span>{isSubmittingFollowUp ? 'Uploading...' : 'Save Follow-up Update'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};

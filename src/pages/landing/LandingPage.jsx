import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Camera,
  ShieldCheck,
  Stethoscope,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Star,
  Users,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { MOCK_MEDICINES, MOCK_EXPERTS } from '../../data/mockData';
import { useCart } from '../../context/CartContext';

export const LandingPage = () => {
  const { addToCart } = useCart();
  const [activeFaq, setActiveFaq] = useState(null);

  const featuredMedicines = MOCK_MEDICINES.slice(0, 4);
  const featuredExperts = MOCK_EXPERTS.slice(0, 3);

  const faqs = [
    {
      q: 'How does CropCare AI identify crop diseases from photos?',
      a: 'CropCare AI utilizes deep computer vision models trained on hundreds of thousands of certified leaf pathology images. When you upload a picture, the model analyzes lesion shapes, discoloration, necrosis patterns, and margin halos to diagnose the disease and prescribe proven curative treatments.'
    },
    {
      q: 'What types of crops are supported?',
      a: 'We currently cover over 40+ major Indian and tropical crops including Tomato, Rice/Paddy, Wheat, Cotton, Potato, Chilli, Maize, Sugarcane, Apple, and various legumes and oilseeds.'
    },
    {
      q: 'Are the recommended agricultural medicines verified and authentic?',
      a: 'Yes. All bio-fungicides, organic pest controls, and chemical formulations featured in our marketplace are sourced from certified manufacturers with active ingredient purity lab tests and government clearance.'
    },
    {
      q: 'Can an agriculture expert visit my farm physically?',
      a: 'Yes! In addition to online 1-on-1 video consultations, you can schedule a physical farm visit by a qualified agronomist or plant pathologist to inspect your soil, crop canopy, and irrigation setup.'
    }
  ];

  return (
    <div className="space-y-20 lg:space-y-28 overflow-hidden pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-8 sm:pt-16 pb-12 sm:pb-20 overflow-hidden bg-gradient-to-b from-emerald-50/70 via-emerald-50/20 to-white">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-emerald-200/40 via-green-100/30 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/70 text-emerald-800 text-xs sm:text-sm font-semibold shadow-2xs">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>Next-Generation AI Precision Agriculture</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
                Protect Your Harvest with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-emerald-500">
                  Instant AI Crop Disease
                </span>{' '}
                Diagnosis.
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Upload a simple leaf photo to identify diseases in seconds, receive customized organic or chemical treatment regimens, order genuine agri-medicines, and consult certified agronomists.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <Link
                  to="/detect"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all"
                >
                  <Camera className="w-5 h-5 text-emerald-100" />
                  <span>Scan Crop Image Now</span>
                </Link>

                <Link
                  to="/marketplace"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-50 text-slate-800 font-semibold rounded-2xl text-base border border-slate-200 shadow-xs hover:border-emerald-300 transition-all"
                >
                  <ShoppingBag className="w-5 h-5 text-emerald-600" />
                  <span>Browse Medicine Store</span>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 border-t border-slate-200/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">98.4% Pathology Accuracy</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">Instant 5-Second Result</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium">100% Certified Medicines</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none rounded-3xl bg-white p-4 shadow-2xl border border-emerald-100 ring-1 ring-slate-900/5">
                
                {/* Crop Photo with Detection Overlays */}
                <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-slate-900">
                  <img
                    src="https://images.unsplash.com/photo-1592417817098-8f3d6910985c?auto=format&fit=crop&w=800&q=80"
                    alt="Tomato Early Blight Detection"
                    className="w-full h-full object-cover opacity-90"
                  />
                  
                  {/* AI Scanner Visual Grid Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
                  
                  {/* Bounding box mock */}
                  <div className="absolute top-1/4 left-1/4 w-36 h-28 border-2 border-emerald-400 rounded-lg bg-emerald-500/10 animate-pulse flex items-start justify-start p-1.5">
                    <span className="text-[10px] font-bold bg-emerald-600 text-white px-1.5 py-0.5 rounded shadow">
                      Pathogen Detected (97.4%)
                    </span>
                  </div>

                  {/* Top Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Live AI Vision Diagnosis</span>
                  </div>

                  {/* Bottom Leaf Diagnosis Summary */}
                  <div className="absolute bottom-3 inset-x-3 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg border border-white/40">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                          Fungal Infection
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-0.5">Tomato Early Blight</h4>
                      </div>
                      <span className="text-emerald-700 font-extrabold text-xs bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-lg">
                        97.4% Match
                      </span>
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Recommended: Copper Oxychloride 50 WP</span>
                      <Link to="/detect" className="text-emerald-600 font-bold hover:underline flex items-center gap-0.5">
                        Test <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Floating Metric Badge */}
                <div className="absolute -bottom-5 -left-5 bg-white rounded-2xl p-3 shadow-xl border border-emerald-100 hidden sm:flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Crop Saved Yield</p>
                    <p className="text-sm font-extrabold text-slate-900">+35% Healthier Harvest</p>
                  </div>
                </div>

                {/* Floating Expert Badge */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl border border-emerald-100 hidden sm:flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                    ICAR
                  </div>
                  <div className="text-left text-xs">
                    <p className="font-bold text-slate-800">Verified Agronomists</p>
                    <p className="text-[10px] text-slate-500">Available on Call</p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          <div className="pt-4 lg:pt-0 lg:px-4 text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">50,000+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Registered Farmers</p>
          </div>
          <div className="pt-4 lg:pt-0 lg:px-4 text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-white">140,000+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Crop Scans Completed</p>
          </div>
          <div className="pt-4 lg:pt-0 lg:px-4 text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400">98.4%</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">Diagnostic Accuracy</p>
          </div>
          <div className="pt-4 lg:pt-0 lg:px-4 text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-white">180+</p>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">ICAR Certified Experts</p>
          </div>
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
            Seamless 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
            How CropCare AI Works For You
          </h2>
          <p className="text-slate-600 text-base mt-3">
            From the first yellowing leaf to full harvest recovery, we guide your field with scientific precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all relative group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              1
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Snap & Upload</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Take a clear photograph of the affected plant leaf, stem, or fruit using any smartphone camera.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all relative group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              2
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Answer 5 Questions</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Provide quick field context such as crop age, weather, symptom progression, and affected area.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all relative group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              3
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Instant AI Diagnosis</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Receive a comprehensive pathology report with pathogen ID, confidence score, and clear action plan.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all relative group">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-lg mb-4 group-hover:scale-110 transition-transform">
              4
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Treat & Consult</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Order certified medicines straight to your farm or book a live video/farm visit with our agronomists.
            </p>
          </div>

        </div>

        <div className="text-center mt-10">
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-sm transition-colors border border-emerald-200"
          >
            <span>Try the Disease Detector Now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 4. FEATURES & BENEFITS SECTION */}
      <section className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-100/70 px-3 py-1 rounded-md">
              Engineered For Modern Agriculture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Features Built to Guarantee High Yields
            </h2>
            <p className="text-slate-600 text-base mt-2">
              Combining cutting-edge artificial intelligence with field-tested agronomic science.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <div className="bg-white p-7 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">98.4% Vision Precision</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Trained on millions of plant lesions across diverse lighting, weather, and soil conditions to distinguish subtle nutrient deficiencies from fungal attacks.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Certified Agri-Store</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Direct access to lab-tested bio-fungicides, selective herbicides, organic pest repellents, and micronutrients with genuine batch QR codes.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1-on-1 Agronomist Consult</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Connect via video call or schedule an in-person farm inspection with agricultural scientists from leading research institutes.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Recovery Tracking</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Maintain historical records of each plot. Upload follow-up photos to verify whether the disease has stopped spreading and monitor regrowth.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Organic & Bio Focus</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Always prioritizes non-toxic, eco-friendly biological control agents before escalating to chemical interventions, preserving soil fertility.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200/70 shadow-xs hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Multilingual Farmer Support</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Designed with large visual touchpoints, simple steps, and 24x7 toll-free helpline assistance in regional languages.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MEDICINE MARKETPLACE PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
              Verified Agri Inputs
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
              Featured Agricultural Medicines
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Guaranteed genuine formulations formulated to cure diagnosed crop infections.
            </p>
          </div>

          <Link
            to="/marketplace"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>View All Medicines</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredMedicines.map((med) => (
            <div
              key={med.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col group"
            >
              <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                <img
                  src={med.imageUrl}
                  alt={med.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                  {med.discount}
                </span>
                <span className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  {med.volume}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {med.category}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                    {med.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {med.description}
                  </p>
                  
                  {/* Crop compatibility tags */}
                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {med.cropCompatibility.slice(0, 3).map((crop) => (
                      <span key={crop} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-extrabold text-slate-900">₹{med.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{med.originalPrice}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{med.rating}</span>
                      <span className="text-slate-400">({med.reviewsCount})</span>
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(med, 1)}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs hover:shadow-emerald-600/30 transition-all"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. EXPERT CONSULTATION PREVIEW */}
      <section className="bg-emerald-900 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest bg-emerald-800 px-3 py-1 rounded-md">
                Certified Agronomists
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
                Consult With Agricultural Specialists
              </h2>
              <p className="text-emerald-100/80 text-sm mt-1 max-w-xl">
                Get individualized advice for your field through instant video calls or book a physical farm inspection visit.
              </p>
            </div>

            <Link
              to="/consultation"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm transition-all"
            >
              <span>Explore All Experts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredExperts.map((expert) => (
              <div
                key={expert.id}
                className="bg-white text-slate-800 rounded-2xl p-5 shadow-xl border border-emerald-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <img
                      src={expert.photoUrl}
                      alt={expert.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-emerald-500"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-slate-900 text-sm">{expert.name}</h4>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-xs text-emerald-700 font-semibold">{expert.title}</p>
                      <p className="text-[11px] text-slate-500">{expert.experience}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-3 line-clamp-2">
                    {expert.bio}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-3">
                    {expert.specializations.slice(0, 3).map((spec) => (
                      <span key={spec} className="text-[10px] bg-emerald-50 text-emerald-800 font-medium px-2 py-0.5 rounded-md">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Consultation From</span>
                    <span className="font-extrabold text-slate-900 text-sm">₹{expert.onlineFee}</span>
                  </div>
                  <Link
                    to={`/consultation`}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
                  >
                    Book Slot
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
            Real Stories From The Field
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
            Trusted by Farmers Across the Nation
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "When black target spots appeared on my 4-acre tomato crop, CropCare AI identified Early Blight in literally 5 seconds. I ordered Kavach fungicide directly, followed the spray schedule, and saved at least ₹80,000 in fruit loss!"
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80"
                alt="Ramesh Patel"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Ramesh Patel</p>
                <p className="text-[11px] text-slate-500">Tomato Grower • Pune, Maharashtra</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "Rice blast used to ruin our tillering stage every monsoon. Dr. Anand Swaminathan guided me during a video consultation on seed treatment and water drainage. Our basmati yield increased by 4 quintals per acre this season."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
                alt="Gurpreet Singh"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Gurpreet Singh</p>
                <p className="text-[11px] text-slate-500">Paddy Farmer • Ludhiana, Punjab</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 italic leading-relaxed">
                "The My Crop History feature is incredible. Being able to compare before and after photos side by side gave me and my cooperative full confidence in the bio-pesticide treatment."
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80"
                alt="Kavitha Reddy"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-xs font-bold text-slate-900">Kavitha Reddy</p>
                <p className="text-[11px] text-slate-500">Chilli & Cotton Grower • Guntur, AP</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 8. FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-md">
            Common Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 font-bold text-slate-900 flex justify-between items-center text-sm sm:text-base hover:text-emerald-700 transition-colors"
              >
                <span>{faq.q}</span>
                <span className={`transform transition-transform text-emerald-600 ${activeFaq === idx ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {activeFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 9. BOTTOM CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 p-8 sm:p-12 lg:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Protect Your Crops with AI?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base">
              Start by uploading your first crop image now. It takes less than 30 seconds to get your complete diagnostic report and treatment plan.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/detect"
                className="px-8 py-3.5 bg-white text-emerald-900 font-bold rounded-xl text-base shadow-lg hover:bg-emerald-50 transition-all"
              >
                Launch Free Crop Scan
              </Link>
              <Link
                to="/register"
                className="px-6 py-3.5 bg-emerald-900/60 hover:bg-emerald-900/90 text-white font-semibold rounded-xl text-base border border-emerald-400/30 transition-all"
              >
                Register as Farmer
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

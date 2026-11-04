import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCrop } from '../../context/CropContext';
import { useCart } from '../../context/CartContext';
import {
  Sparkles,
  ScanLine,
  ShoppingBag,
  History,
  Stethoscope,
  CalendarCheck,
  Package,
  TrendingUp,
  AlertTriangle,
  Sun,
  Droplets,
  Wind,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { MOCK_MEDICINES } from '../../data/mockData';

export const FarmerDashboard = () => {
  const { user } = useAuth();
  const { historyList, appointments } = useCrop();
  const { addToCart } = useCart();

  // Metrics
  const totalAnalyses = historyList.length + 12; // historical total
  const recentReports = historyList.slice(0, 3);
  const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Scheduled');
  const recommendedMeds = MOCK_MEDICINES.slice(0, 3);

  return (
    <div className="space-y-8 pb-10">
      
      {/* 1. WELCOME BANNER WITH LOCAL WEATHER SUMMARY */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 text-white p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-400/30 text-emerald-200 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Smart Farming Season 2026 • Kharif Advisory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.fullName || 'Ramesh Patel'}!
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              Farm: <strong className="text-white">{user?.farmName || 'Green Valley Farms'}</strong> • {user?.village || 'Kisan Nagar'}, {user?.district || 'Pune'} ({user?.farmSize || '6.5 Acres'})
            </p>
          </div>

          {/* Quick Weather Widget for Farm Plot */}
          <div className="bg-white/15 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex items-center gap-6 text-xs text-emerald-100 shrink-0">
            <div className="flex items-center gap-2">
              <Sun className="w-7 h-7 text-amber-300" />
              <div>
                <span className="text-lg font-extrabold text-white block">28°C</span>
                <span>Partly Sunny</span>
              </div>
            </div>
            <div className="border-l border-white/20 pl-4 space-y-1">
              <div className="flex items-center gap-1.5">
                <Droplets className="w-3.5 h-3.5 text-blue-200" />
                <span>Humidity: 68%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="w-3.5 h-3.5 text-emerald-200" />
                <span>Wind: 11 km/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Button Strip */}
        <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap gap-3">
          <Link
            to="/detect"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Scan New Crop Leaf</span>
          </Link>
          <Link
            to="/consultation"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-900/50 hover:bg-emerald-900/70 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all"
          >
            <Stethoscope className="w-4 h-4 text-emerald-300" />
            <span>Consult Agronomist</span>
          </Link>
          <Link
            to="/marketplace"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-900/50 hover:bg-emerald-900/70 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all"
          >
            <ShoppingBag className="w-4 h-4 text-emerald-300" />
            <span>Order Agri-Medicines</span>
          </Link>
          <Link
            to="/farmer/history"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-900/50 hover:bg-emerald-900/70 text-white rounded-xl text-xs sm:text-sm font-semibold border border-white/20 transition-all"
          >
            <History className="w-4 h-4 text-emerald-300" />
            <span>View Recovery Progress</span>
          </Link>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Crop Analyses</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalAnalyses}</p>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              <span>4 scans this week</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ScanLine className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Plots Monitored</p>
            <p className="text-2xl font-black text-slate-900 mt-1">4 Plots</p>
            <span className="text-[11px] text-slate-500 font-medium block mt-1">
              Tomato, Paddy, Wheat, Cotton
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming Bookings</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{upcomingAppointments.length}</p>
            <span className="text-[11px] text-amber-600 font-semibold block mt-1">
              Next: Nov 4, 3:30 PM
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medicine Orders</p>
            <p className="text-2xl font-black text-slate-900 mt-1">2 Dispatches</p>
            <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
              1 In Transit (Delivery Tomorrow)
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 3. RECENT SCANS & RECENT DISEASE REPORTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Recent Disease Reports */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Crop Disease Reports</h2>
              <p className="text-xs text-slate-500">Live summary of diagnostic evaluations performed on your crops.</p>
            </div>
            <Link
              to="/farmer/history"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>Full History</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {recentReports.map((report) => (
              <div
                key={report.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={report.originalImage}
                    alt={report.cropName}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-200 bg-white"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{report.diseaseName}</h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        report.statusType === 'success'
                          ? 'bg-emerald-100 text-emerald-800'
                          : report.statusType === 'resolved'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {report.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {report.cropName} • {report.fieldLocation} • Scanned {report.uploadDate}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-1 italic">
                      Rx: {report.treatmentTaken}
                    </p>
                  </div>
                </div>

                <Link
                  to="/farmer/history"
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 font-semibold rounded-lg text-xs transition-colors shrink-0"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/detect"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scan another plant leaf to update status</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Upcoming Expert Appointments & Alerts */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Appointments Box */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>Upcoming Consultations</span>
              </h3>
              <Link to="/farmer/appointments" className="text-xs font-bold text-emerald-700 hover:underline">
                View All
              </Link>
            </div>

            {upcomingAppointments.length === 0 ? (
              <p className="text-xs text-slate-500 py-3">No upcoming appointments booked.</p>
            ) : (
              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-slate-900">{apt.expertName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-bold">
                        {apt.type}
                      </span>
                    </div>
                    <p className="text-slate-600">{apt.crop}</p>
                    <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-emerald-100 text-[11px]">
                      <span>📅 {apt.date}</span>
                      <span>⏰ {apt.timeSlot}</span>
                    </div>
                    {apt.meetingLink && (
                      <a
                        href={apt.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 block text-center py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px]"
                      >
                        Join Video Call Room
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            <Link
              to="/consultation"
              className="w-full text-center block py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors"
            >
              + Book New Agronomist
            </Link>
          </div>

          {/* Seasonal Advisory Card */}
          <div className="p-5 rounded-3xl bg-amber-50 border border-amber-200/70 space-y-2 text-amber-950">
            <div className="flex items-center gap-2 font-bold text-xs text-amber-800 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Seasonal Pest Alert</span>
            </div>
            <h4 className="font-bold text-sm">High Humidity Fungal Threat</h4>
            <p className="text-xs text-amber-900/80 leading-relaxed">
              Recent rainfall in Pune district has elevated powdery mildew risks in vegetables. Maintain drip irrigation and avoid overhead sprinkling.
            </p>
          </div>

        </div>

      </div>

      {/* 4. RECOMMENDED MEDICINES SECTION */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recommended Agricultural Medicines for Your Crops
            </h2>
            <p className="text-xs text-slate-500">
              Prescribed based on your active crop diagnostics (Tomato Early Blight & Rice Blast).
            </p>
          </div>
          <Link
            to="/marketplace"
            className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Visit Medicine Store</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {recommendedMeds.map((med) => (
            <div
              key={med.id}
              className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-4/3 rounded-xl overflow-hidden mb-3 bg-slate-50">
                  <img
                    src={med.imageUrl}
                    alt={med.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {med.category}
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1.5 line-clamp-1">{med.name}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{med.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 line-through">₹{med.originalPrice}</span>
                  <span className="text-base font-extrabold text-slate-900 ml-1.5">₹{med.price}</span>
                </div>
                <button
                  onClick={() => addToCart(med, 1)}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

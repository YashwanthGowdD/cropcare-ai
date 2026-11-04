import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Award,
  ShoppingBag,
  CalendarCheck,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { MOCK_ADMIN_STATS } from '../../data/mockData';

export const AdminDashboard = () => {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Admin Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-purple-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Central Agricultural Intelligence Command</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            CropCare AI – Operations Dashboard
          </h1>
          <p className="text-purple-200/80 text-sm max-w-xl">
            Live telemetry across 14,800+ farmers, 180+ verified plant pathologists, and nationwide agri-medicine fulfillment.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/admin/medicines"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            + Add Medicine
          </Link>
          <Link
            to="/admin/reports"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-colors"
          >
            Export Reports
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Farmers */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Farmers</p>
            <p className="text-2xl font-black text-white mt-1">{MOCK_ADMIN_STATS.totalFarmers.toLocaleString()}</p>
            <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
              {MOCK_ADMIN_STATS.activeFarmersGrowth}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Total Experts */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Accredited Agronomists</p>
            <p className="text-2xl font-black text-white mt-1">{MOCK_ADMIN_STATS.totalExperts}</p>
            <span className="text-[11px] text-purple-400 font-semibold block mt-1">
              ICAR & State Univ Certified
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center border border-purple-500/20">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Medicine Orders</p>
            <p className="text-2xl font-black text-white mt-1">{MOCK_ADMIN_STATS.totalOrders.toLocaleString()}</p>
            <span className="text-[11px] text-amber-400 font-semibold block mt-1">
              Revenue: {MOCK_ADMIN_STATS.revenue}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Appointments */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Expert Appointments</p>
            <p className="text-2xl font-black text-white mt-1">{MOCK_ADMIN_STATS.totalAppointments.toLocaleString()}</p>
            <span className="text-[11px] text-blue-400 font-semibold block mt-1">
              96.2% Satisfaction Rate
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Disease Distribution & Recent Farmers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Top Diagnosed Plant Pathogens */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-white text-base">Top Diagnosed Plant Pathogens</h3>
              <p className="text-xs text-slate-400">Aggregated breakdown across 34,600+ leaf scans this season.</p>
            </div>
            <Link to="/admin/reports" className="text-xs font-bold text-purple-400 hover:underline">
              Detailed Analytics →
            </Link>
          </div>

          <div className="space-y-4">
            {MOCK_ADMIN_STATS.topDiseases.map((dis) => (
              <div key={dis.name} className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-200">{dis.name}</span>
                  <span className="text-slate-400">{dis.count} cases ({dis.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-emerald-400 h-2.5 rounded-full"
                    style={{ width: `${dis.percentage * 2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Pathology Model Status: <strong>Operational (Standard Mode)</strong></span>
            </span>
            <span className="text-slate-400">No Model Connected</span>
          </div>
        </div>

        {/* Recent Farmer Registrations */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-white text-base">Recent Farmer Sign-ups</h3>
            <Link to="/admin/farmers" className="text-xs font-bold text-purple-400 hover:underline">
              View All ({MOCK_ADMIN_STATS.totalFarmers})
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_ADMIN_STATS.recentRegistrations.map((f) => (
              <div
                key={f.id}
                className="p-3 rounded-2xl bg-slate-800/40 border border-slate-800 hover:border-purple-500/30 transition-colors flex items-center justify-between text-xs"
              >
                <div>
                  <p className="font-bold text-white">{f.name}</p>
                  <p className="text-[11px] text-slate-400">{f.village}, {f.district}, {f.state}</p>
                  <span className="text-[10px] text-purple-300 font-mono mt-0.5 inline-block">Crops: {f.crops}</span>
                </div>
                <span className="text-[10px] text-slate-500">{f.joined}</span>
              </div>
            ))}
          </div>

          <Link
            to="/admin/farmers"
            className="w-full text-center block py-2.5 text-xs font-bold text-purple-300 bg-purple-900/30 hover:bg-purple-900/50 rounded-xl border border-purple-500/20 transition-colors"
          >
            Manage All Farmers
          </Link>
        </div>

      </div>

    </div>
  );
};

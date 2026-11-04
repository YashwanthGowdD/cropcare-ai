import React from 'react';
import { Award, Star } from 'lucide-react';
import { MOCK_EXPERTS } from '../../data/mockData';

export const AdminExpertsPage = () => {
  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Accredited Agronomists & Pathologists
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Registered agricultural scientists offering tele-consultation and physical farm diagnostics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_EXPERTS.map((expert) => (
          <div
            key={expert.id}
            className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={expert.photoUrl}
                  alt={expert.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-500 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-white text-base">{expert.name}</h3>
                    <Award className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-xs text-purple-300 font-semibold">{expert.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{expert.qualification}</p>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs">
                    <div className="flex items-center gap-1 font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{expert.rating}</span>
                    </div>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-400">{expert.completedConsultations} sessions completed</span>
                  </div>
                </div>
              </div>

              <div className="mt-3.5 flex flex-wrap gap-1.5">
                {expert.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2.5 py-0.5 rounded-md border border-slate-700"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 block text-[10px]">Fee Schedule</span>
                <span className="text-white font-bold">Online: ₹{expert.onlineFee} | Visit: ₹{expert.farmVisitFee}</span>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold border border-emerald-500/20">
                Active & Verified
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Search, CheckCircle2 } from 'lucide-react';
import { MOCK_ADMIN_STATS } from '../../data/mockData';

export const AdminFarmersPage = () => {
  const [search, setSearch] = useState('');
  const [farmersList] = useState([
    ...MOCK_ADMIN_STATS.recentRegistrations,
    { id: 'f-105', name: 'Sukhwinder Kaur', state: 'Punjab', district: 'Bathinda', village: 'Rampura', crops: 'Cotton, Mustard', joined: '3 days ago' },
    { id: 'f-106', name: 'Balram Yadav', state: 'Madhya Pradesh', district: 'Indore', village: 'Sanwer', crops: 'Soybean, Wheat', joined: '4 days ago' },
    { id: 'f-107', name: 'Ananya Roy', state: 'West Bengal', district: 'Nadia', village: 'Ranaghat', crops: 'Paddy, Jute', joined: '5 days ago' },
  ]);

  const filtered = farmersList.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.state.toLowerCase().includes(search.toLowerCase()) ||
    f.district.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Farmers Directory & Verification
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Registered agricultural producers utilizing CropCare AI diagnostics.
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search farmer or district..."
            className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-700 text-white rounded-xl focus:border-purple-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
              <tr>
                <th className="p-4">Farmer Name</th>
                <th className="p-4">Location Coordinates</th>
                <th className="p-4">Crops Cultivated</th>
                <th className="p-4">Status</th>
                <th className="p-4">Registered</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((farmer) => (
                <tr key={farmer.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-white flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                      {farmer.name[0]}
                    </div>
                    <span>{farmer.name}</span>
                  </td>
                  <td className="p-4 text-slate-400">
                    {farmer.village}, {farmer.district}, {farmer.state}
                  </td>
                  <td className="p-4 font-medium text-purple-300">
                    {farmer.crops}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified Farmer</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{farmer.joined}</td>
                  <td className="p-4 text-right">
                    <button className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg text-xs font-semibold">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

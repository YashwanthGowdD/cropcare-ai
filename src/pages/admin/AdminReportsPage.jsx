import React, { useState } from 'react';
import { Download } from 'lucide-react';

export const AdminReportsPage = () => {
  const [reports] = useState([
    { id: 'LOG-9921', crop: 'Tomato', disease: 'Early Blight (Alternaria solani)', confidence: 97.4, severity: 'Moderate', farmer: 'Ramesh Patel', location: 'Pune, Maharashtra', date: '2026-11-02' },
    { id: 'LOG-9920', crop: 'Rice / Paddy', disease: 'Rice Blast (Magnaporthe oryzae)', confidence: 95.8, severity: 'High', farmer: 'Gurpreet Singh', location: 'Ludhiana, Punjab', date: '2026-11-01' },
    { id: 'LOG-9919', crop: 'Wheat', disease: 'Yellow Stripe Rust', confidence: 94.2, severity: 'High', farmer: 'Manish Verma', location: 'Varanasi, UP', date: '2026-10-31' },
    { id: 'LOG-9918', crop: 'Cotton', disease: 'Cotton Leaf Curl Virus', confidence: 92.5, severity: 'Moderate', farmer: 'Kavitha Reddy', location: 'Guntur, AP', date: '2026-10-30' },
    { id: 'LOG-9917', crop: 'Potato', disease: 'Late Blight (Phytophthora)', confidence: 96.1, severity: 'Severe', farmer: 'Rakesh Sharma', location: 'Agra, UP', date: '2026-10-29' },
    { id: 'LOG-9916', crop: 'Chilli', disease: 'Anthracnose Fruit Rot', confidence: 93.8, severity: 'Moderate', farmer: 'Deepak Patil', location: 'Kolhapur, MH', date: '2026-10-28' },
  ]);

  const [search, setSearch] = useState('');

  const handleExportCSV = () => {
    alert('Exporting 34,650 national disease diagnosis logs to CSV format...');
  };

  const filtered = reports.filter(r =>
    r.disease.toLowerCase().includes(search.toLowerCase()) ||
    r.crop.toLowerCase().includes(search.toLowerCase()) ||
    r.farmer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            National Crop Pathology Reports & Logs
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Aggregated computer vision disease detection logs submitted by farmers nationwide.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crop or disease..."
            className="text-xs px-3 py-2 bg-slate-900 border border-slate-700 text-white rounded-xl outline-none"
          />
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
              <tr>
                <th className="p-4">Report ID</th>
                <th className="p-4">Crop</th>
                <th className="p-4">Identified Plant Pathogen</th>
                <th className="p-4">Assessment Type</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Reporting Farmer</th>
                <th className="p-4">Coordinates</th>
                <th className="p-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">{log.id}</td>
                  <td className="p-4 font-semibold text-white">{log.crop}</td>
                  <td className="p-4 font-medium text-purple-300">{log.disease}</td>
                  <td className="p-4 font-semibold text-emerald-400">Standard Diagnosis</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      log.severity === 'Severe'
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                        : log.severity === 'High'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{log.farmer}</td>
                  <td className="p-4 text-slate-400">{log.location}</td>
                  <td className="p-4 text-slate-500">{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

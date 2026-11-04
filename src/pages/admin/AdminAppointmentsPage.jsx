import React, { useState } from 'react';
import { Video, MapPin } from 'lucide-react';
import { useCrop } from '../../context/CropContext';

export const AdminAppointmentsPage = () => {
  const { appointments } = useCrop();
  const [list, setList] = useState([
    ...appointments,
    {
      id: 'APT-0941',
      expertId: 'exp-003',
      expertName: 'Er. Rajeshwar Verma',
      expertTitle: 'Chief Entomologist',
      type: 'Physical Farm Visit',
      date: '2026-11-10',
      timeSlot: '02:00 PM - 04:00 PM',
      status: 'Scheduled',
      crop: 'Cotton Bollworm Assessment',
      farmLocation: 'Rampura Village, Bathinda, Punjab',
      fee: 799
    }
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setList(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
  };

  return (
    <div className="space-y-6 pb-12">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Agronomist Consultation Bookings
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Monitor scheduled farmer video consultations and assigned physical field audits.
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 text-[10px]">
              <tr>
                <th className="p-4">Booking Ref</th>
                <th className="p-4">Assigned Expert</th>
                <th className="p-4">Format</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Crop Problem</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {list.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-bold text-white">#{apt.id}</td>
                  <td className="p-4">
                    <p className="font-bold text-white">{apt.expertName}</p>
                    <p className="text-[10px] text-slate-400">{apt.expertTitle}</p>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-slate-300">
                      {apt.type === 'Online Video Call' ? <Video className="w-3.5 h-3.5 text-emerald-400" /> : <MapPin className="w-3.5 h-3.5 text-blue-400" />}
                      <span>{apt.type}</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">
                    <p>{apt.date}</p>
                    <p className="text-[10px] text-slate-500">{apt.timeSlot}</p>
                  </td>
                  <td className="p-4 text-purple-300 font-medium">{apt.crop}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {apt.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <select
                      value={apt.status}
                      onChange={(e) => handleUpdateStatus(apt.id, e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-white rounded-lg text-xs py-1 px-2 outline-none cursor-pointer"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Scheduled">Scheduled</option>
                      <option value="Completed">Completed</option>
                    </select>
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

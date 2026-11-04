import React from 'react';
import { Video, MapPin, Stethoscope } from 'lucide-react';
import { useCrop } from '../../context/CropContext';
import { Link } from 'react-router-dom';

export const AppointmentsPage = () => {
  const { appointments } = useCrop();

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Agronomist Appointments
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage your booked 1-on-1 video consultations and scheduled physical farm inspections.
          </p>
        </div>

        <Link
          to="/consultation"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-xs shrink-0"
        >
          <Stethoscope className="w-4 h-4" />
          <span>Book New Expert</span>
        </Link>
      </div>

      {appointments.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800 text-base">No appointments booked yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Connect directly with verified ICAR agronomists to diagnose complex crop issues.
          </p>
          <Link
            to="/consultation"
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Schedule Consultation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    Ref: #{apt.id}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                    {apt.status}
                  </span>
                </div>

                <div className="mt-3 flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    {apt.type === 'Online Video Call' ? <Video className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{apt.expertName}</h3>
                    <p className="text-xs text-emerald-700 font-semibold">{apt.expertTitle}</p>
                    <span className="inline-block mt-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                      Format: {apt.type}
                    </span>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs text-slate-600">
                  <p><strong>Target Crop Issue:</strong> {apt.crop}</p>
                  <p><strong>Location Coordinates:</strong> {apt.farmLocation}</p>
                  <div className="flex items-center justify-between text-slate-800 pt-1 font-semibold">
                    <span>📅 {apt.date}</span>
                    <span>⏰ {apt.timeSlot}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                  <span className="text-base font-extrabold text-slate-900">₹{apt.fee}</span>
                </div>

                {apt.meetingLink ? (
                  <a
                    href={apt.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Video Meeting</span>
                  </a>
                ) : (
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-xl border border-blue-200">
                    Agronomist Will Visit Farm
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

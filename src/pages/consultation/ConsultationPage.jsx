import React, { useState } from 'react';
import {
  Video,
  MapPin,
  Star,
  Award,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Info,
  X
} from 'lucide-react';
import { MOCK_EXPERTS } from '../../data/mockData';
import { useCrop } from '../../context/CropContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const ConsultationPage = () => {
  const { bookAppointment } = useCrop();
  const { user } = useAuth();

  const todayDateStr = new Date().toISOString().split('T')[0];

  const [activeService, setActiveService] = useState('all'); // 'all' | 'online' | 'visit'
  const [selectedExpertForBooking, setSelectedExpertForBooking] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  
  // Booking Modal State
  const [bookingForm, setBookingForm] = useState({
    consultationType: 'Online Video Call',
    date: todayDateStr,
    timeSlot: '03:30 PM - 04:00 PM',
    crop: 'Tomato Early Blight',
    farmLocation: user?.village ? `${user.village}, ${user.district}, ${user.state}` : 'Kisan Nagar, Pune District',
    acres: '4.5 Acres',
    notes: 'Need expert confirmation on copper fungicide dosing and irrigation schedule.'
  });

  const [bookingConfirmed, setBookingConfirmed] = useState(null);

  const timeSlots = [
    '09:30 AM - 10:00 AM',
    '11:00 AM - 11:30 AM',
    '02:00 PM - 02:30 PM',
    '03:30 PM - 04:00 PM',
    '05:00 PM - 05:30 PM'
  ];

  const handleOpenBooking = (expert, defaultType = 'Online Video Call') => {
    setSelectedExpertForBooking(expert);
    setBookingError('');
    setBookingForm(prev => ({
      ...prev,
      consultationType: defaultType,
      date: prev.date < todayDateStr ? todayDateStr : prev.date
    }));
    setBookingConfirmed(null);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExpertForBooking) return;

    if (bookingForm.date < todayDateStr) {
      setBookingError('Selected appointment date cannot be in the past. Please choose a present or future date.');
      return;
    }

    if (bookingForm.consultationType === 'Physical Farm Visit' && (!bookingForm.farmLocation || !bookingForm.farmLocation.trim())) {
      setBookingError('Farm visit location coordinates are required for physical farm visits.');
      return;
    }

    setIsSubmitting(true);
    setBookingError('');

    try {
      const fee = bookingForm.consultationType === 'Online Video Call'
        ? selectedExpertForBooking.onlineFee
        : selectedExpertForBooking.farmVisitFee;

      const confirmed = await bookAppointment({
        expertId: selectedExpertForBooking.id,
        expertName: selectedExpertForBooking.name,
        expertTitle: selectedExpertForBooking.title,
        type: bookingForm.consultationType,
        date: bookingForm.date,
        timeSlot: bookingForm.timeSlot,
        crop: bookingForm.crop,
        farmLocation: bookingForm.farmLocation,
        acres: bookingForm.acres,
        notes: bookingForm.notes,
        fee
      });

      setBookingConfirmed(confirmed);
    } catch (err) {
      console.error('Booking request error:', err);
      setBookingError(err.message || 'Failed to submit booking request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5 text-emerald-600" />
            <span>ICAR & Agricultural University Certified</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Consult Senior Agronomists & Pathologists
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl">
            Schedule live 1-on-1 video consultations or request an in-person farm visit by leading agricultural plant pathology scientists.
          </p>
        </div>

        {/* 2 Service Options Quick Selector */}
        <div className="bg-slate-100 p-1 rounded-2xl flex items-center shrink-0">
          <button
            onClick={() => setActiveService('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeService === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Services
          </button>
          <button
            onClick={() => setActiveService('online')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeService === 'online' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Online Call (₹249+)</span>
          </button>
          <button
            onClick={() => setActiveService('visit')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              activeService === 'visit' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Farm Visit (₹799+)</span>
          </button>
        </div>
      </div>

      {/* Service Explanatory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Service 1: Online Consultation */}
        <div className="bg-gradient-to-br from-emerald-50 via-white to-white p-6 rounded-3xl border border-emerald-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-600/20">
            <Video className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Service 1</span>
            <h3 className="font-extrabold text-slate-900 text-lg">Online Video & Tele-Consultation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Connect in real-time over smartphone video. Show your live crop leaves, ask dosage questions, and receive an instant digital prescription.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-bold text-emerald-800">
              <span>⚡ Fast 15-30 Min Slots</span>
              <span>₹249 - ₹349 per session</span>
            </div>
          </div>
        </div>

        {/* Service 2: Physical Farm Visit */}
        <div className="bg-gradient-to-br from-blue-50 via-white to-white p-6 rounded-3xl border border-blue-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-600/20">
            <MapPin className="w-6 h-6" />
          </div>
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Service 2</span>
            <h3 className="font-extrabold text-slate-900 text-lg">Physical Farm Inspection Visit</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              A certified plant pathologist visits your acreage in person. They sample soil, check irrigation distribution, and inspect full canopy health.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs font-bold text-blue-800">
              <span>🚜 2-Hour Comprehensive Field Audit</span>
              <span>₹799 - ₹999 per visit</span>
            </div>
          </div>
        </div>

      </div>

      {/* Expert Profile Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">
            Available Agricultural Specialists ({MOCK_EXPERTS.length})
          </h2>
          <span className="text-xs text-slate-500 font-medium">Verified credentials and ICAR accreditation</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_EXPERTS.map((expert) => (
            <div
              key={expert.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={expert.photoUrl}
                      alt={expert.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                    />
                    {expert.availableToday && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white" title="Available Today" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-slate-900 text-base">{expert.name}</h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </div>
                    <p className="text-xs font-semibold text-emerald-700">{expert.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{expert.qualification}</p>
                    
                    <div className="flex items-center gap-2 mt-2 text-xs">
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{expert.rating}</span>
                        <span className="text-slate-400 font-normal">({expert.reviewCount})</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-600 font-medium text-[11px]">{expert.experience}</span>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 mt-4 leading-relaxed">
                  {expert.bio}
                </p>

                {/* Specializations */}
                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {expert.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                </div>

                {/* Languages */}
                <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Languages:</span>
                  <span>{expert.languages.join(', ')}</span>
                </div>
              </div>

              {/* Booking Actions Strip */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs">
                  <span className="text-slate-400 block text-[10px]">Next Open Slot</span>
                  <span className="font-bold text-slate-800">{expert.nextSlot}</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleOpenBooking(expert, 'Online Video Call')}
                    className="flex-1 sm:flex-none px-3.5 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs transition-colors border border-emerald-200 flex items-center justify-center gap-1"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Online (₹{expert.onlineFee})</span>
                  </button>

                  <button
                    onClick={() => handleOpenBooking(expert, 'Physical Farm Visit')}
                    className="flex-1 sm:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-xs flex items-center justify-center gap-1"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Farm Visit (₹{expert.farmVisitFee})</span>
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* BOOKING MODAL */}
      {selectedExpertForBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 relative my-8">
            
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedExpertForBooking.photoUrl}
                  alt={selectedExpertForBooking.name}
                  className="w-12 h-12 rounded-xl object-cover border border-emerald-400"
                />
                <div>
                  <h3 className="font-bold text-base">{selectedExpertForBooking.name}</h3>
                  <p className="text-xs text-emerald-200">{selectedExpertForBooking.title}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedExpertForBooking(null)}
                className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* If Confirmed View */}
            {bookingConfirmed ? (
              <div className="p-6 sm:p-8 text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Consultation Request Submitted!</h3>
                <p className="text-xs text-emerald-700 font-bold">Booking Request ID: #{bookingConfirmed.id}</p>

                <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 text-left text-xs text-emerald-950 space-y-1">
                  <strong className="block font-bold text-emerald-900">Consultation Scheduled</strong>
                  <span>Your request has been forwarded to the certified plant pathologist. You will receive session access details on your dashboard.</span>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs text-slate-700 space-y-2">
                  <p><strong>Consultation Type:</strong> {bookingConfirmed.type}</p>
                  <p><strong>Date & Time:</strong> {bookingConfirmed.date} at {bookingConfirmed.timeSlot}</p>
                  <p><strong>Target Crop:</strong> {bookingConfirmed.crop}</p>
                  <p><strong>Location:</strong> {bookingConfirmed.farmLocation}</p>
                  <p><strong>Consultation Fee:</strong> ₹{bookingConfirmed.fee}</p>
                  {bookingConfirmed.meetingLink && (
                    <p className="text-emerald-700"><strong>Meeting Link:</strong> {bookingConfirmed.meetingLink}</p>
                  )}
                </div>

                <div className="pt-2 flex gap-2">
                  <Link
                    to="/farmer/appointments"
                    onClick={() => setSelectedExpertForBooking(null)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors"
                  >
                    View in My Appointments
                  </Link>
                  <button
                    onClick={() => setSelectedExpertForBooking(null)}
                    className="px-4 py-3 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-700"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Booking Form */
              <form onSubmit={handleBookingSubmit} className="p-6 sm:p-8 space-y-4">
                
                {bookingError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <Info className="w-4 h-4 shrink-0 text-red-600" />
                    <span>{bookingError}</span>
                  </div>
                )}

                {/* Service Type Radio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Select Consultation Format *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                      bookingForm.consultationType === 'Online Video Call'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="consultationType"
                          checked={bookingForm.consultationType === 'Online Video Call'}
                          onChange={() => setBookingForm(prev => ({ ...prev, consultationType: 'Online Video Call' }))}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-slate-900">Online Video Call</span>
                      </div>
                      <span className="text-emerald-700 font-extrabold text-xs mt-2">₹{selectedExpertForBooking.onlineFee}</span>
                    </label>

                    <label className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                      bookingForm.consultationType === 'Physical Farm Visit'
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="consultationType"
                          checked={bookingForm.consultationType === 'Physical Farm Visit'}
                          onChange={() => setBookingForm(prev => ({ ...prev, consultationType: 'Physical Farm Visit' }))}
                          className="text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="text-xs font-bold text-slate-900">Physical Farm Visit</span>
                      </div>
                      <span className="text-emerald-700 font-extrabold text-xs mt-2">₹{selectedExpertForBooking.farmVisitFee}</span>
                    </label>
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayDateStr}
                      value={bookingForm.date}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full text-xs py-2.5 px-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Time Slot *
                    </label>
                    <select
                      value={bookingForm.timeSlot}
                      onChange={(e) => setBookingForm(prev => ({ ...prev, timeSlot: e.target.value }))}
                      className="w-full text-xs py-2.5 px-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none bg-white"
                    >
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Target Crop */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Crop & Problem Brief *
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingForm.crop}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, crop: e.target.value }))}
                    placeholder="e.g. Tomato Early Blight / Rice Neck Blast"
                    className="w-full text-xs py-2.5 px-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                {/* Farm Location (Particularly essential for Physical Farm Visit) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {bookingForm.consultationType === 'Physical Farm Visit' ? 'Farm Visit Address Coordinates *' : 'Farmer Location'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={bookingForm.farmLocation}
                    onChange={(e) => setBookingForm(prev => ({ ...prev, farmLocation: e.target.value }))}
                    placeholder="Farm name, Village, District, Land acreage"
                    className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedExpertForBooking(null)}
                    className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 rounded-xl text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-600/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? 'Submitting Request...' : 'Confirm & Book Consultation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};

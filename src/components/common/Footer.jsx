import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      {/* Top Banner - Farmer Helpline */}
      <div className="bg-emerald-800 text-white py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-sm">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-white/20 rounded-md">
              <Phone className="w-4 h-4" />
            </span>
            <span className="font-semibold">Kisan Krishi Emergency Helpline:</span>
            <a href="tel:18004251555" className="underline font-bold text-emerald-100 hover:text-white">
              1800-425-1555 (Toll-Free, 24x7 Support)
            </a>
          </div>
          <div className="flex items-center gap-4 text-xs text-emerald-100">
            <span>✓ Available in 12 Indian Languages</span>
            <span className="hidden md:inline">• ICAR Certified Agronomists</span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-400 flex items-center justify-center text-white shadow-md">
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white text-xl">CropCare</span>
                <span className="text-emerald-400 font-bold text-xl">AI</span>
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Empowering farmers with state-of-the-art AI crop disease identification, tailored organic & chemical treatments, direct marketplace delivery, and expert agronomy consultations.
            </p>
            <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-emerald-400 border border-slate-700">
                <ShieldCheck className="w-3.5 h-3.5" />
                ICAR Benchmark Aligned
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                98.4% Diagnostic Precision
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Features</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/detect" className="hover:text-emerald-400 transition-colors">
                  AI Disease Detection
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="hover:text-emerald-400 transition-colors">
                  Agri Medicine Store
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:text-emerald-400 transition-colors">
                  Online Video Consultations
                </Link>
              </li>
              <li>
                <Link to="/consultation" className="hover:text-emerald-400 transition-colors">
                  Physical Farm Visits
                </Link>
              </li>
              <li>
                <Link to="/farmer/history" className="hover:text-emerald-400 transition-colors">
                  Crop Recovery Tracking
                </Link>
              </li>
            </ul>
          </div>

          {/* Farmer Portal */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Farmer Portal</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/farmer" className="hover:text-emerald-400 transition-colors">
                  Farmer Dashboard
                </Link>
              </li>
              <li>
                <Link to="/farmer/orders" className="hover:text-emerald-400 transition-colors">
                  My Orders & Invoices
                </Link>
              </li>
              <li>
                <Link to="/farmer/appointments" className="hover:text-emerald-400 transition-colors">
                  My Expert Bookings
                </Link>
              </li>
              <li>
                <Link to="/farmer/profile" className="hover:text-emerald-400 transition-colors">
                  Farm Profile & Soil Data
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                  Admin Control Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Support & Offices</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>National Agricultural Innovation Hub, Sector 14, Pune, MH - 411005</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@cropcare.ai</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>+91 20 2894 1100</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CropCare AI – Smart Farming Assistant. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Farmer Safety Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

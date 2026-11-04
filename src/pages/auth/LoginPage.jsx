import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, User, Award, Shield } from 'lucide-react';

export const LoginPage = () => {
  const [activeTab, setActiveTab] = useState('farmer'); // 'farmer' | 'expert' | 'admin'
  const [emailOrPhone, setEmailOrPhone] = useState('ramesh.farmer@cropcare.ai');
  const [password, setPassword] = useState('CropCare@2026');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const { loginFarmer, loginExpert, loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!emailOrPhone || !password) {
      setError('Please provide valid credentials.');
      return;
    }

    if (activeTab === 'farmer') {
      loginFarmer({ email: emailOrPhone, fullName: 'Ramesh Patel' });
      navigate('/farmer');
    } else if (activeTab === 'expert') {
      loginExpert({ email: emailOrPhone, fullName: 'Dr. Anand Swaminathan' });
      navigate('/consultation');
    } else if (activeTab === 'admin') {
      loginAdmin();
      navigate('/admin');
    }
  };

  const handleQuickDemo = (role) => {
    if (role === 'farmer') {
      loginFarmer({ email: 'ramesh.farmer@cropcare.ai', fullName: 'Ramesh Patel' });
      navigate('/farmer');
    } else if (role === 'expert') {
      loginExpert({ email: 'anand.pathology@cropcare.ai', fullName: 'Dr. Anand Swaminathan' });
      navigate('/consultation');
    } else if (role === 'admin') {
      loginAdmin();
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/70">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-md">
              <Sprout className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-2xl text-slate-900 tracking-tight">CropCare AI</span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900">
            Sign in to your account
          </h2>
          <p className="text-xs text-slate-500">
            Select your portal type to access smart farm diagnostics
          </p>
        </div>

        {/* Tab selection */}
        <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('farmer');
              setEmailOrPhone('ramesh.farmer@cropcare.ai');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'farmer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Farmer</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('expert');
              setEmailOrPhone('anand.pathology@cropcare.ai');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'expert'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Expert</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setEmailOrPhone('admin@cropcare.ai');
            }}
            className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'admin'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>

        {/* Login Card */}
        <div className="bg-white p-7 sm:p-8 rounded-3xl border border-slate-200/80 shadow-lg space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {activeTab === 'expert' ? 'License ID or Email' : activeTab === 'admin' ? 'Admin Username / Email' : 'Email or Mobile Number'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  className="w-full text-sm pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder={activeTab === 'expert' ? 'expert@cropcare.ai' : 'farmer@cropcare.ai or 9876543210'}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-sm pl-10 pr-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                  placeholder="••••••••••••"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-slate-600">Keep me logged in</span>
              </label>
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-4 font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2 text-white ${
                activeTab === 'admin'
                  ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
              }`}
            >
              <span>Sign In as {activeTab === 'farmer' ? 'Farmer' : activeTab === 'expert' ? 'Agronomist' : 'Admin'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Instant Access Buttons */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 text-center mb-2.5">
              Instant 1-Click Demo Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo('farmer')}
                className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold rounded-lg border border-emerald-200 transition-colors"
              >
                Demo Farmer
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('expert')}
                className="py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold rounded-lg border border-blue-200 transition-colors"
              >
                Demo Expert
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo('admin')}
                className="py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-800 text-[11px] font-bold rounded-lg border border-purple-200 transition-colors"
              >
                Demo Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-600 pt-2">
            Don't have a farmer account?{' '}
            <Link to="/register" className="font-bold text-emerald-600 hover:text-emerald-700">
              Register here
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

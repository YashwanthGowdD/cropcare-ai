import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sprout, ShoppingBag, Menu, X, Shield, Sparkles, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export const Navbar = () => {
  const { user, isAuthenticated, logout, loginAdmin } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Detect Disease', path: '/detect' },
    { label: 'Medicine Store', path: '/marketplace' },
    { label: 'Expert Consultation', path: '/consultation' },
    { label: 'Farmer Dashboard', path: '/farmer' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-emerald-700 to-green-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20 group-hover:scale-105 transition-transform">
              <Sprout className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-gray-900 text-lg sm:text-xl tracking-tight">CropCare</span>
                <span className="text-emerald-600 font-extrabold text-lg sm:text-xl">AI</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider uppercase bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md">Smart Farming</span>
              </div>
              <p className="text-[11px] text-gray-500 hidden sm:block font-medium">Smart Farming Assistant</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-semibold'
                      : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Upload CTA (Desktop) */}
            <Link
              to="/detect"
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm hover:shadow-emerald-600/25"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Scan Crop</span>
            </Link>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors border border-gray-100"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-in zoom-in-50">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Role switch / Auth menu */}
            <div className="relative">
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-gray-200 hover:border-emerald-300 bg-white transition-all text-left"
                  >
                    <img
                      src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                      alt={user?.fullName}
                      className="w-7 h-7 rounded-lg object-cover border border-emerald-600/20"
                    />
                    <div className="hidden sm:block text-xs">
                      <p className="font-semibold text-gray-800 line-clamp-1">{user?.fullName}</p>
                      <span className="text-[10px] text-emerald-600 font-medium uppercase">{user?.role}</span>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 text-sm animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-semibold text-gray-900">{user?.fullName}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded-md uppercase bg-emerald-50 text-emerald-700">
                          Role: {user?.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/farmer"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          Farmer Dashboard
                        </Link>
                        <Link
                          to="/farmer/history"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          My Crop History
                        </Link>
                        <Link
                          to="/farmer/orders"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/farmer/appointments"
                          onClick={() => setRoleDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          My Appointments
                        </Link>
                        <Link
                          to="/admin"
                          onClick={() => {
                            loginAdmin();
                            setRoleDropdownOpen(false);
                          }}
                          className="flex items-center justify-between px-4 py-2 text-purple-700 hover:bg-purple-50"
                        >
                          <span>Switch to Admin</span>
                          <Shield className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="border-t border-gray-100 pt-1">
                        <button
                          onClick={() => {
                            setRoleDropdownOpen(false);
                            handleLogout();
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 text-xs font-semibold"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-gray-700 hover:text-emerald-700 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-emerald-700 hover:bg-gray-100 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-xl text-base font-medium text-gray-700 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-3 border-t border-gray-100 space-y-2">
            <Link
              to="/farmer/history"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              My Crop History
            </Link>
            <Link
              to="/admin"
              onClick={() => {
                loginAdmin();
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-purple-700 bg-purple-50"
            >
              Admin Dashboard Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

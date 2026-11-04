import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { FarmerSidebar } from '../components/farmer/FarmerSidebar';
import { Menu, X, Sparkles, ShoppingBag, Bell } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CartDrawer } from '../components/common/CartDrawer';

export const FarmerLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { itemCount, setIsCartOpen } = useCart();
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block h-full">
        <FarmerSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white z-10 shadow-2xl">
            <div className="absolute top-3 right-3">
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <FarmerSidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 shrink-0 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                Active Farm: {user?.farmName || 'Green Valley Farms'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Action - Detect */}
            <Link
              to="/detect"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Scan Crop</span>
            </Link>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 pb-2 border-b border-gray-100 flex justify-between items-center font-bold text-gray-900">
                    <span>Farm Notifications</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">2 New</span>
                  </div>
                  <div className="divide-y divide-gray-50">
                    <div className="p-3 hover:bg-gray-50 transition-colors">
                      <p className="font-semibold text-gray-900">Follow-up Spray Due Tomorrow</p>
                      <p className="text-gray-500 mt-0.5">Tomato Early Blight spray #2 (Kavach Copper Oxychloride) is scheduled for 8:00 AM.</p>
                      <span className="text-[10px] text-emerald-600 font-medium">Tomorrow, 8:00 AM</span>
                    </div>
                    <div className="p-3 hover:bg-gray-50 transition-colors">
                      <p className="font-semibold text-gray-900">Appointment Confirmed</p>
                      <p className="text-gray-500 mt-0.5">Dr. Sunita Deshmukh confirmed online consultation on Nov 4 at 3:30 PM.</p>
                      <span className="text-[10px] text-gray-400">1 hour ago</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile Avatar Link */}
            <Link
              to="/farmer/profile"
              className="flex items-center gap-2 pl-2 border-l border-gray-200"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                alt={user?.fullName}
                className="w-8 h-8 rounded-lg object-cover border border-emerald-500/20"
              />
            </Link>

          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      <CartDrawer />
    </div>
  );
};

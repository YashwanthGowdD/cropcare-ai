import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { CartDrawer } from '../components/common/CartDrawer';
import { useCart } from '../context/CartContext';
import { Check } from 'lucide-react';

export const MainLayout = () => {
  const { toastMessage } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      <Navbar />
      
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
      <CartDrawer />

      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-slate-700 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
            <Check className="w-3.5 h-3.5 stroke-3" />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

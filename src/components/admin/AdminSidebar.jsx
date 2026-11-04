import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Award,
  Package,
  ShoppingBag,
  CalendarCheck,
  FileSpreadsheet,
  ArrowLeft,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ onClose }) => {
  const { loginFarmer, logout } = useAuth();
  const navigate = useNavigate();

  const adminNavItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Farmers', path: '/admin/farmers', icon: Users },
    { label: 'Experts', path: '/admin/experts', icon: Award },
    { label: 'Medicines & Inventory', path: '/admin/medicines', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Appointments', path: '/admin/appointments', icon: CalendarCheck },
    { label: 'Disease Reports', path: '/admin/reports', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-full shrink-0 border-r border-slate-800">
      {/* Brand header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-white tracking-tight text-base">CropCare</span>
              <span className="text-purple-400 font-extrabold text-base">Admin</span>
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Operations Central</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          Management
        </div>
        {adminNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-600/20 text-purple-300 font-semibold border border-purple-500/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        <div className="pt-4 mt-4 border-t border-slate-800">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Portal Switch
          </div>
          <button
            onClick={() => {
              loginFarmer({ fullName: 'Ramesh Patel' });
              navigate('/farmer');
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-emerald-400 hover:bg-emerald-950/40 border border-emerald-900/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Farmer Portal</span>
          </button>
        </div>
      </nav>

      {/* Admin Profile Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs border border-purple-500/30">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">Super Admin</p>
            <p className="text-[10px] text-slate-400 truncate">admin@cropcare.ai</p>
          </div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="text-slate-400 hover:text-red-400 p-1.5"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

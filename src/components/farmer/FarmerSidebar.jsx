import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ScanLine,
  ShoppingBag,
  History,
  Stethoscope,
  Package,
  CalendarCheck,
  User,
  LogOut,
  Sprout,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const FarmerSidebar = ({ onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const farmerNavItems = [
    { label: 'Dashboard', path: '/farmer', icon: LayoutDashboard, exact: true },
    { label: 'Detect Disease', path: '/detect', icon: ScanLine },
    { label: 'Medicine Store', path: '/marketplace', icon: ShoppingBag },
    { label: 'My Crop History', path: '/farmer/history', icon: History },
    { label: 'Expert Consultation', path: '/consultation', icon: Stethoscope },
    { label: 'My Orders', path: '/farmer/orders', icon: Package },
    { label: 'My Appointments', path: '/farmer/appointments', icon: CalendarCheck },
    { label: 'Profile', path: '/farmer/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full shrink-0">
      {/* Brand header */}
      <div className="p-5 border-b border-gray-100">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-gray-900 tracking-tight text-base">CropCare</span>
              <span className="text-emerald-600 font-extrabold text-base">AI</span>
            </div>
            <p className="text-[10px] text-gray-400 font-medium">Farmer Control Panel</p>
          </div>
        </NavLink>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Main Menu
        </div>
        {farmerNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-emerald-50 text-emerald-800 font-semibold shadow-xs'
                  : 'text-gray-600 hover:text-emerald-700 hover:bg-gray-50'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 transition-colors group-hover:text-emerald-600" />
              <span>{item.label}</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-600" />
          </NavLink>
        ))}

        {/* Quick Admin Shortcut link */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Administration
          </div>
          <NavLink
            to="/admin"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-700 hover:bg-purple-50 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-purple-600" />
            <span>Admin Portal</span>
          </NavLink>
        </div>
      </nav>

      {/* Farmer Profile Footer */}
      <div className="p-3 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-gray-100 shadow-2xs">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
            alt={user?.fullName || 'Farmer'}
            className="w-9 h-9 rounded-lg object-cover border border-emerald-600/20"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{user?.fullName || 'Ramesh Patel'}</p>
            <p className="text-[10px] text-gray-500 truncate">{user?.village || 'Kisan Nagar'}, {user?.district || 'Pune'}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

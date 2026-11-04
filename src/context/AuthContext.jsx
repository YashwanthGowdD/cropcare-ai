import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

const DEFAULT_FARMER = {
  id: 'usr-farmer-01',
  role: 'farmer', // 'farmer' | 'expert' | 'admin'
  fullName: 'Ramesh Patel',
  email: 'ramesh.farmer@cropcare.ai',
  mobile: '+91 98765 43210',
  state: 'Maharashtra',
  district: 'Pune',
  village: 'Kisan Nagar',
  farmName: 'Green Valley Farms',
  farmSize: '6.5 Acres',
  primaryCrops: ['Tomato', 'Rice', 'Chilli'],
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cropcare_user');
    return saved ? JSON.parse(saved) : DEFAULT_FARMER;
  });

  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('cropcare_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('cropcare_user');
    }
  }, [user]);

  const loginFarmer = async (credentials) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await api.auth.login({
        emailOrPhone: credentials.email || credentials.emailOrPhone || DEFAULT_FARMER.email,
        password: credentials.password || 'CropCare@2026',
        role: 'farmer'
      });
      setUser(response.user);
      setLoading(false);
      return response.user;
    } catch (err) {
      console.warn('API login failed, falling back to local demo state:', err.message);
      // Fallback to local user if API temporarily unavailable
      const fallbackUser = {
        ...DEFAULT_FARMER,
        email: credentials.email || credentials.emailOrPhone || DEFAULT_FARMER.email,
        fullName: credentials.fullName || DEFAULT_FARMER.fullName,
        role: 'farmer'
      };
      setUser(fallbackUser);
      setLoading(false);
      return fallbackUser;
    }
  };

  const loginExpert = async (credentials) => {
    setLoading(true);
    try {
      const response = await api.auth.login({
        emailOrPhone: credentials.email || 'anand.pathology@cropcare.ai',
        password: credentials.password || 'CropCare@2026',
        role: 'expert'
      });
      setUser(response.user);
      setLoading(false);
      return response.user;
    } catch {
      const expertUser = {
        id: 'usr-expert-01',
        role: 'expert',
        fullName: credentials.fullName || 'Dr. Anand Swaminathan',
        email: credentials.email || 'anand.pathology@cropcare.ai',
        licenseNumber: 'AGRI-ICAR-9021',
        specialization: 'Senior Plant Pathologist',
        experience: '16+ Years',
        rating: 4.95,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      };
      setUser(expertUser);
      setLoading(false);
      return expertUser;
    }
  };

  const loginAdmin = async () => {
    const adminUser = {
      id: 'usr-admin-01',
      role: 'admin',
      fullName: 'Super Admin',
      email: 'admin@cropcare.ai',
      department: 'Central Agriculture Board Operations',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80'
    };
    setUser(adminUser);
    return adminUser;
  };

  const registerFarmer = async (formData) => {
    setLoading(true);
    setAuthError(null);
    try {
      const response = await api.auth.register(formData);
      setUser(response.user);
      setLoading(false);
      return response.user;
    } catch (err) {
      console.warn('API register failed, creating local demo farmer:', err.message);
      const newFarmer = {
        id: `usr-farmer-${Date.now()}`,
        role: 'farmer',
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        state: formData.state,
        district: formData.district,
        village: formData.village,
        farmName: `${formData.village} Agri Farm`,
        farmSize: '4 Acres',
        primaryCrops: ['Tomato', 'Wheat'],
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
      };
      setUser(newFarmer);
      setLoading(false);
      return newFarmer;
    }
  };

  const updateUserProfile = async (updates) => {
    setLoading(true);
    try {
      if (user?.id) {
        await api.auth.updateProfile(user.id, updates);
      }
    } catch (err) {
      console.warn('Profile update API error:', err.message);
    }
    setUser(prev => ({ ...prev, ...updates }));
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      authError,
      isAuthenticated: !!user,
      isFarmer: user?.role === 'farmer',
      isExpert: user?.role === 'expert',
      isAdmin: user?.role === 'admin',
      loginFarmer,
      loginExpert,
      loginAdmin,
      registerFarmer,
      updateUserProfile,
      logout,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

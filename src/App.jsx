import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CropProvider } from './context/CropContext';

// Layouts
import { MainLayout } from './layouts/MainLayout';
import { FarmerLayout } from './layouts/FarmerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public & Main Pages
import { LandingPage } from './pages/landing/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { DetectDiseasePage } from './pages/farmer/DetectDiseasePage';
import { MarketplacePage } from './pages/marketplace/MarketplacePage';
import { ConsultationPage } from './pages/consultation/ConsultationPage';

// Farmer Dashboard & Subpages
import { FarmerDashboard } from './pages/farmer/FarmerDashboard';
import { CropHistoryPage } from './pages/farmer/CropHistoryPage';
import { OrdersPage } from './pages/farmer/OrdersPage';
import { AppointmentsPage } from './pages/farmer/AppointmentsPage';
import { ProfilePage } from './pages/farmer/ProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminFarmersPage } from './pages/admin/AdminFarmersPage';
import { AdminExpertsPage } from './pages/admin/AdminExpertsPage';
import { AdminMedicinesPage } from './pages/admin/AdminMedicinesPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminAppointmentsPage } from './pages/admin/AdminAppointmentsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CropProvider>
            <Routes>
              
              {/* Public & Core Agritech Pages */}
              <Route path="/" element={<MainLayout />}>
                <Route index element={<LandingPage />} />
                <Route path="detect" element={<DetectDiseasePage />} />
                <Route path="marketplace" element={<MarketplacePage />} />
                <Route path="consultation" element={<ConsultationPage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
              </Route>

              {/* Farmer Dedicated Control Panel Layout */}
              <Route path="/farmer" element={<FarmerLayout />}>
                <Route index element={<FarmerDashboard />} />
                <Route path="history" element={<CropHistoryPage />} />
                <Route path="orders" element={<OrdersPage />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Admin Operations Control Center Layout */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="farmers" element={<AdminFarmersPage />} />
                <Route path="experts" element={<AdminExpertsPage />} />
                <Route path="medicines" element={<AdminMedicinesPage />} />
                <Route path="orders" element={<AdminOrdersPage />} />
                <Route path="appointments" element={<AdminAppointmentsPage />} />
                <Route path="reports" element={<AdminReportsPage />} />
              </Route>

              {/* Fallback to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
          </CropProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

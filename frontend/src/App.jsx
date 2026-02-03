import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// --- PAGES IMPORT ---
import LandingPage from './pages/LandingPage';
import AdminLogin from './pages/AdminLogin';
import ConsumerLogin from './pages/ConsumerLogin';
import AdminDashboard from './pages/AdminDashboard';
import ConsumerDashboard from './pages/CustomerDashboard';

// --- SECURITY GUARDS ---
// 1. Only allow Admin
const AdminRoute = ({ children }) => {
  const { user } = useApp();
  return (user && user.role === 'admin') ? children : <Navigate to="/admin-login" />;
};

// 2. Only allow Consumer
const ConsumerRoute = ({ children }) => {
  const { user } = useApp();
  return (user && user.role === 'consumer') ? children : <Navigate to="/consumer-login" />;
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Routes>
            <Route path="/" element={<LandingPage />} />

            {/* Login Pages */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/consumer-login" element={<ConsumerLogin />} />

            {/* PROTECTED ROUTES */}
            <Route path="/admin-dashboard" element={
              <AdminRoute><AdminDashboard /></AdminRoute>
            } />

            <Route path="/consumer-dashboard" element={
              <ConsumerRoute><ConsumerDashboard /></ConsumerRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}
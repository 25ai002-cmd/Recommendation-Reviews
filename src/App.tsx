import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CustomerReviewPage } from './pages/CustomerReviewPage';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public SaaS landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* Business authentication */}
        <Route path="/login" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Business owner dashboard */}
        <Route path="/dashboard" element={<DashboardPage />} />

        {/* Customer NFC Tap / QR Landing Pages */}
        <Route path="/r/:slug" element={<CustomerReviewPage />} />
        <Route path="/review/:slug" element={<CustomerReviewPage />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;

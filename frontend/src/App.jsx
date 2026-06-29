import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReservations from './pages/admin/AdminReservations';
import AdminDishes from './pages/admin/AdminDishes';
import AdminChefs from './pages/admin/AdminChefs';
import AdminEvents from './pages/admin/AdminEvents';
import AdminTestimonials from './pages/admin/AdminTestimonials';
import AdminSettings from './pages/admin/AdminSettings';
import AdminGallery from './pages/admin/AdminGallery';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Website */}
        <Route path="/" element={<PublicLayout />} />

        {/* Admin CMS */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="reservations" element={<AdminReservations />} />
          <Route path="dishes" element={<AdminDishes />} />
          <Route path="chefs" element={<AdminChefs />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="gallery" element={<AdminGallery />} />
        </Route>
      </Routes>
    </Router>
  );
}

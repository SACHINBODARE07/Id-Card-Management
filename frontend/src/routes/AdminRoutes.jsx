import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/layout/AdminDashboard';
import AdminLogin from '../components/forms/AdminLogin';
import AdminRegister from '../components/forms/AdminRegister';

const AdminRoutes = () => {
  return (
    <Router>
     <Routes>
     <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            localStorage.getItem('adminToken') ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/admin/login" />
            )
          }
        />
        {/* Other routes */}
      </Routes>
    </Router>
  );
};

export default AdminRoutes;

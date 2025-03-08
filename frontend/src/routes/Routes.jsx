import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "../pages/Auth/Register";
import Login from "../pages/Auth/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import UserDashboard from "../pages/user/UserDashboard";
import ProtectedRoute from './ProtectedRoute';
import ProfilePage from "../pages/user/ProfilePage";
import IDCardRequestPage from "../pages/user/IDCardRequestPage";
import ChangePasswordPage from "../pages/user/ChangePasswordPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect "/" to "/dashboard" or "/login" */}
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/user/change-password" element={<ChangePasswordPage />} />
        <Route 
      path="/user/dashboard" 
      element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} 
    />
    <Route path="/user/dashboard" element={<Navigate to="/login" replace />} />
    <Route path="/user/profile" element={<ProfilePage />} />
    <Route path="/user/id-card-request" element={<IDCardRequestPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

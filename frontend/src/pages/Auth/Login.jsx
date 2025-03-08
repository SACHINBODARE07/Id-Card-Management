import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/login`, 
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/user/dashboard");
    } catch (error) {
      console.error("Login error details:", error);
      
      let errorMessage = "Check your network connection and try again";
      if (error.response) {
        // Server responded with non-2xx status
        errorMessage = error.response.data.message || `Server error: ${error.response.status}`;
      } else if (error.request) {
        // Request made but no response received
        errorMessage = "No response from server - check if backend is running";
      }
      
      alert(`Login failed: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold text-center mb-4">Login</h2>
        <input type="email" name="email" placeholder="Email" onChange={handleChange} className="input mb-3" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} className="input mb-3" />
        <button type="submit" className="btn mt-4">Login</button>
        <p className="text-center mt-4">
          Don't have an account? <a href="/register" className="text-blue-500">Register</a>
        </p>
        <p className="text-center mt-2">
          Forgot your password? <a href="/user/change-password" className="text-blue-500">Reset Password</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
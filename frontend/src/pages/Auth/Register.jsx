import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    state: "",
    district: "",
    taluka: "",
    village: "",
    password: "",
    confirmPassword: "",
    photo: null,
    agreeToTerms: false,
    recaptchaVerified: false,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName) newErrors.firstName = "First name is required.";
    if (!formData.lastName) newErrors.lastName = "Last name is required.";
    if (!formData.email) newErrors.email = "Email address is required.";
    if (!formData.contactNumber) newErrors.contactNumber = "Contact number is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";
    if (!formData.photo) newErrors.photo = "Photo is required.";
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to the Terms and Conditions.";
    if (!formData.recaptchaVerified) newErrors.recaptcha = "Please verify the reCAPTCHA.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true); // Set loading to true

    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSend.append(key, value);
    });

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        alert("Registration successful!");
        window.location.reload();
      } else {
        alert("Registration failed: " + response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Registration failed: " + (error.response?.data?.message || "Unknown error"));
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-500 p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-lg font-bold text-center mb-4">Register</h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 text-sm">First Name</label>
            <input type="text" className="input" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
          </div>
          <div>
            <label className="block text-gray-600 text-sm">Last Name</label>
            <input type="text" className="input" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
          </div>
        </div>

        <label className="block text-gray-600 text-sm mt-4">Email Address</label>
        <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

        <label className="block text-gray-600 text-sm mt-4">Contact Number</label>
        <input type="text" className="input" value={formData.contactNumber} onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })} />
        {errors.contactNumber && <p className="text-red-500 text-xs">{errors.contactNumber}</p>}
        
        <label className="block font-medium">State</label>
        <input type="text" className="border border-gray-300 p-2 w-full rounded-md"
          value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
        {errors.state && <p className="text-red-500 text-xs">{errors.state}</p>}

        <label className="block font-medium">District</label>
        <input type="text" className="border border-gray-300 p-2 w-full rounded-md"
          value={formData.district} onChange={(e) => setFormData({ ...formData, district: e.target.value })} />
        {errors.district && <p className="text-red-500 text-xs">{errors.district}</p>}

        <label className="block font-medium">Taluka</label>
        <input type="text" className="border border-gray-300 p-2 w-full rounded-md"
          value={formData.taluka} onChange={(e) => setFormData({ ...formData, taluka: e.target.value })} />
        {errors.taluka && <p className="text-red-500 text-xs">{errors.taluka}</p>}

        <label className="block font-medium">Village</label>
        <input type="text" className="border border-gray-300 p-2 w-full rounded-md"
          value={formData.village} onChange={(e) => setFormData({ ...formData, village: e.target.value })} />
        {errors.village && <p className="text-red-500 text-xs">{errors.village}</p>}

        <label className="block text-gray-600 text-sm mt-4">Password</label>
        <input type="password" className="input" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

        <label className="block text-gray-600 text-sm mt-4">Confirm Password</label>
        <input type="password" className="input" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />
        {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}

        <label className="block text-gray-600 text-sm mt-4">Upload Photo</label>
        <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })} className="input" />
        {errors.photo && <p className="text-red-500 text-xs">{errors.photo}</p>}

        <div className="flex items-center mt-4">
          <input type="checkbox" id="terms" checked={formData.agreeToTerms} onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })} className="mr-2" />
          <label htmlFor="terms" className="text-sm text-gray-600">I agree to the <a href="#" className="text-blue-600">Terms and Conditions</a></label>
        </div>
        {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms}</p>}

        <div className="mt-4">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={() => setFormData({ ...formData, recaptchaVerified: true })}
          />
          {errors.recaptcha && <p className="text-red-500 text-xs">{errors.recaptcha}</p>}
        </div>

        <button type="submit" className="btn mt-4" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>

        <p className="text-center mt-4">
          Already have an account? <a href="/login" className="text-blue-600">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
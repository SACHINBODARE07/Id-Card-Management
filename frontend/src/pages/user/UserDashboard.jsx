import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, User, ArrowRight, IdCard, KeyRound, Download } from 'lucide-react';
import ProfilePage from './ProfilePage';
import IDCardRequestPage from './IDCardRequestPage';
import ChangePasswordPage from './ChangePasswordPage';

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState({});
  const [idCardRequests, setIdCardRequests] = useState([]);

  // Fetch user profile
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/auth/user-profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  // Fetch ID card requests for the user
  useEffect(() => {
    const fetchIDCardRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8000/api/auth/idcard/status', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIdCardRequests(response.data);
      } catch (error) {
        console.error('Error fetching ID card requests:', error);
      }
    };
    fetchIDCardRequests();
  }, []);

  const handleSectionClick = (section) => setActiveSection(section);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const downloadIDCard = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:8000/api/auth/idcard/download/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `IDCard_${userId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading ID card:', error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'identity-card':
        return (
          <IDCardRequestPage
            user={user}
            idCardRequests={idCardRequests}
            downloadIDCard={downloadIDCard}
          />
        );
      case 'change-password':
        return <ChangePasswordPage user={user} />;
      case 'profile':
        return <ProfilePage user={user} />;
      default:
        return (
          <div>
            <h2>Welcome to the Dashboard, {user.firstName}!</h2>
            <p>You can manage your profile, request ID cards, and change your password from here.</p>
          </div>
        );
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="mr-2" /> },
    { id: 'identity-card', label: 'Identity Card', icon: <IdCard className="mr-2" /> },
    { id: 'profile', label: 'Profile', icon: <User className="mr-2" /> },
    { id: 'change-password', label: 'Change Password', icon: <KeyRound className="mr-2" /> },
    {
      id: 'signout',
      label: 'Signout',
      icon: <ArrowRight className="mr-2" />,
      onClick: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      },
    },
  ];

  return (
    <div className="flex h-screen bg-white flex-col">
      {/* Top Navbar */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <button onClick={toggleSidebar}>
          <Home className="mr-2" />
        </button>
        <div>
          <User className="mr-2" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        {sidebarOpen && (
          <nav className="w-64 bg-gray-800 text-white p-5">
            <h2 className="text-lg font-bold mb-4">User Panel</h2>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <button
                    className={`flex items-center p-3 w-full text-left ${
                      activeSection === item.id ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => (item.onClick ? item.onClick() : handleSectionClick(item.id))}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Main Content */}
        <main className="flex-1 p-5 bg-gray-100">
          <div className="bg-blue-500 text-white p-5 rounded mb-4 flex justify-between items-center">
            <h2>Welcome Back, {user.firstName} {user.lastName}</h2>
            <button
              onClick={() => handleSectionClick('profile')}
              className="text-white flex items-center"
            >
              View Profile <ArrowRight />
            </button>
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-4">
              {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
            </h1>
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        <a href="#" className="mx-2">Terms of use</a>
        <a href="#" className="mx-2">Privacy policy</a>
        <span>All Rights Reserved @Ramoshi.com</span>
      </footer>
    </div>
  );
}
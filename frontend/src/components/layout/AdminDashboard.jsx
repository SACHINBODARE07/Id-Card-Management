import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Home, Users, Shield, Settings, Calendar, Search, Menu, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [idCardRequests, setIdCardRequests] = useState([]);
  const [activeSection, setActiveSection] = useState('dashboard');
  const navigate = useNavigate();

  // Fetch all registered users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    }
  };

  // Fetch all ID card requests
  const fetchIDCardRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get('http://localhost:8000/api/admin/idcard/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIdCardRequests(response.data.requests);
    } catch (error) {
      console.error('Error fetching ID card requests:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    }
  };

  // Fetch data based on active section
  useEffect(() => {
    if (activeSection === 'users') {
      fetchUsers();
    } else if (activeSection === 'idcard-requests') {
      fetchIDCardRequests();
    }
  }, [activeSection]);

  // Handle ID card request actions (approve/reject)
  const handleIDCardRequestAction = async (requestId, status) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      await axios.put(
        `http://localhost:8000/api/admin/idcard/requests/${requestId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchIDCardRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating ID card request:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    }
  };

  // Delete an ID card request
  const deleteIDCardRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      await axios.delete(`http://localhost:8000/api/admin/idcard/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchIDCardRequests(); // Refresh the list
    } catch (error) {
      console.error('Error deleting ID card request:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    }
  };

  // Download ID card as PDF
  const downloadIDCard = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      const response = await axios.get(`http://localhost:8000/api/admin/idcard/generate/${userId}`, {
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
      console.error('Error downloading ID card:', error.response ? error.response.data : error.message);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter ID card requests based on search term
  const filteredIDCardRequests = idCardRequests.filter(
    (request) =>
      request.User.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.User.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.idCardType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Top Navbar */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-white hover:text-gray-300">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold ml-4">Admin Panel</h1>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search User by name, email &"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-700 text-white border-gray-600 focus:ring-blue-500 w-full p-2 pr-10 rounded"
            />
            <button onClick={() => console.log('Search:', searchTerm)} className="absolute right-2 top-2 text-gray-400 hover:text-gray-300">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-grow">
        {/* Navigation Menu */}
        <aside className={`bg-gray-800 text-white w-64 p-4 flex flex-col ${isMenuOpen ? 'block' : 'hidden md:block'}`}>
          <nav className="space-y-2 flex-grow">
            <div className="text-gray-400 font-semibold mb-2">CORE</div>
            <button
              onClick={() => setActiveSection('dashboard')}
              className="flex items-center w-full p-2 text-left text-white hover:bg-gray-700 rounded"
            >
              <Home className="mr-2 h-4 w-4" /> Dashboard
            </button>
            <button
              onClick={() => setActiveSection('users')}
              className="flex items-center w-full p-2 text-left text-white hover:bg-gray-700 rounded"
            >
              <Users className="mr-2 h-4 w-4" /> Manage Users
            </button>
            <button
              onClick={() => setActiveSection('idcard-requests')}
              className="flex items-center w-full p-2 text-left text-white hover:bg-gray-700 rounded"
            >
              <Shield className="mr-2 h-4 w-4" /> Manage ID Cards
            </button>
            <button
              onClick={() => setActiveSection('settings')}
              className="flex items-center w-full p-2 text-left text-white hover:bg-gray-700 rounded"
            >
              <Settings className="mr-2 h-4 w-4" /> Settings
            </button>
            <button
              onClick={() => setActiveSection('reports')}
              className="flex items-center w-full p-2 text-left text-white hover:bg-gray-700 rounded"
            >
              <Calendar className="mr-2 h-4 w-4" /> B/w Dates Report
            </button>
            <button
              onClick={() => {
                localStorage.removeItem('adminToken');
                navigate('/admin/login');
              }}
              className="flex items-center w-full p-2 text-left text-white hover:bg-gray-700 rounded"
            >
              Signout
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-grow p-4">
          {activeSection === 'dashboard' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
              <p>Welcome to the Admin Dashboard!</p>
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Manage Users</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Name</th>
                    <th className="p-2 border">Email</th>
                    <th className="p-2 border">Contact</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="border">
                        <td className="p-2 border">{user.firstName} {user.lastName}</td>
                        <td className="p-2 border">{user.email}</td>
                        <td className="p-2 border">{user.contactNumber}</td>
                        <td className="p-2 border">
                          <button
                            onClick={() => downloadIDCard(user.id)}
                            className="bg-blue-500 text-white px-2 py-1 rounded"
                          >
                            Generate ID Card
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-2 text-center">No users found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'idcard-requests' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Manage ID Card Requests</h2>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">User</th>
                    <th className="p-2 border">ID Card Type</th>
                    <th className="p-2 border">Issue Date</th>
                    <th className="p-2 border">Expiry Date</th>
                    <th className="p-2 border">Status</th>
                    <th className="p-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredIDCardRequests.length > 0 ? (
                    filteredIDCardRequests.map((request) => (
                      <tr key={request.id} className="border">
                        <td className="p-2 border">{request.User.firstName} {request.User.lastName}</td>
                        <td className="p-2 border">{request.idCardType}</td>
                        <td className="p-2 border">{new Date(request.issueDate).toLocaleDateString()}</td>
                        <td className="p-2 border">{new Date(request.expiryDate).toLocaleDateString()}</td>
                        <td className="p-2 border">{request.status}</td>
                        <td className="p-2 border">
                          {request.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleIDCardRequestAction(request.id, 'Approved')}
                                className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleIDCardRequestAction(request.id, 'Rejected')}
                                className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => deleteIDCardRequest(request.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {request.status === 'Approved' && (
                            <button
                              onClick={() => downloadIDCard(request.User.id)}
                              className="bg-blue-500 text-white px-2 py-1 rounded"
                            >
                              <Download className="mr-2 h-4 w-4" /> Download ID Card
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-2 text-center">No ID card requests found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeSection === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p>System settings will be displayed here.</p>
            </div>
          )}

          {activeSection === 'reports' && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Reports</h2>
              <p>Reports between specific dates will be displayed here.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>Copyright © 2025</p>
        <a href="#" className="text-gray-400 hover:text-gray-300">Terms of Use</a>
      </footer>
    </div>
  );
}
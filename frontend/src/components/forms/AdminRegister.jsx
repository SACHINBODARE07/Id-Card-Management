import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(null); // Initialize as null to show loading state
  const navigate = useNavigate();

  useEffect(() => {
    // Replace with actual admin check logic
    const checkAdminStatus = async () => {
      try {
        // Simulate an API call to check if the user is an admin
        const response = await fetch('/api/check-admin');
        const data = await response.json();
        setIsAdmin(data.isAdmin);
        if (!data.isAdmin) {
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/admin/login');
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAdmin) {
      console.error('Only admins can register new admins.');
      return;
    }
    // TODO: Implement API call for admin registration
    console.log('Admin Register:', { email, password });
  };

  if (isAdmin === null) {
    return <p>Loading...</p>;
  }

  return (
    <div style={styles.authContainer}>
      <form style={styles.authForm} onSubmit={handleSubmit}>
        <h2>Admin Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>
      </form>
      <p>
        Already have an account? <span onClick={() => navigate('/admin/login')} style={styles.link}>Login here</span>
      </p>
    </div>
  );
};

const styles = {
  authContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  authForm: {
    display: 'flex',
    flexDirection: 'column',
    width: '300px',
    padding: '20px',
    borderRadius: '5px',
    boxShadow: '0 0 10px rgba(0 , 0, 0, 0.1)',
    backgroundColor: '#fff',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
  link: {
    cursor: 'pointer',
    color: 'blue',
    textDecoration: 'underline',
  },
};

export default AdminRegister;
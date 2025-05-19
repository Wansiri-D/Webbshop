import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ setIsAdmin, setNotification }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // สมมติข้อมูลแอดมิน (ในโปรเจกต์จริงควรใช้ Firebase Authentication)
    const adminCredentials = {
      username: 'admin',
      password: 'password',
    };

    if (username === adminCredentials.username && password === adminCredentials.password) {
      setIsAdmin(true);
      navigate('/admin');
    } else {
      setNotification('Oops! Incorrect username or password. Please try again. 😓');
    }

    setLoading(false);
  };

  return (
    <div className="admin-page">
      <div className="edit-form">
        <h1 className="admin-login-title">Admin Login</h1>
        <p className="secondary-text welcome-text admin-login-subtitle">
          Please log in to manage your products and orders.
        </p>
        <form onSubmit={handleLogin} className="admin-form admin-login-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
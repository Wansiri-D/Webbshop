import React, { useState } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import AddProduct from './admin/AddProduct';
import EditProducts from './admin/EditProducts';

// คอมโพเนนต์ Modal สำหรับแสดงข้อความแจ้งเตือน
const NotificationModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '18px', color: '#4A4A4A', marginBottom: '20px' }}>
          {message}
        </p>
        <button
          style={{
            backgroundColor: '#FF865E',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState(null);

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
  };

  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <nav className="admin-nav">
          <NavLink
            to="/admin/add"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <span className="nav-icon">➕</span> Add Product
          </NavLink>
          <NavLink
            to="/admin/edit"
            className={({ isActive }) => (isActive ? 'admin-nav-link active' : 'admin-nav-link')}
          >
            <span className="nav-icon">✏️</span> Edit Products
          </NavLink>
          <button
            onClick={handleLogout}
            className="admin-nav-link admin-logout"
          >
            <span className="nav-icon">🚪</span> Log out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <Routes>
          <Route path="add" element={<AddProduct setNotification={setNotification} />} />
          <Route path="edit" element={<EditProducts setNotification={setNotification} />} />
          <Route path="/" element={<AddProduct setNotification={setNotification} />} />
        </Routes>
      </div>

      {/* แสดง Modal สำหรับแจ้งเตือน */}
      <NotificationModal message={notification} onClose={closeNotification} />
    </div>
  );
};

export default Admin;
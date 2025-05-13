import React from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import AddProduct from './admin/AddProduct';
import EditProducts from './admin/EditProducts';

const Admin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log('Logging out...');
    navigate('/');
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
          <Route path="add" element={<AddProduct />} />
          <Route path="edit" element={<EditProducts />} />
          <Route path="/" element={<AddProduct />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
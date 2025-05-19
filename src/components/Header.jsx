import React from 'react';
import { Link, NavLink } from 'react-router-dom';

// Import images จาก src/assets/
import logo from '../assets/sun.png';
import cartIcon from '../assets/cart-icon.png';
import adminIcon from '../assets/admin-icon.png';

const Header = ({ cartCount }) => {
  return (
    <header className="navbar">
      {/* Products ด้านซ้าย */}
      <div className="navbar-left">
        <NavLink
          to="/products"
          className={({ isActive }) => (isActive ? 'products-link active' : 'products-link')}
        >
          Products
        </NavLink>
      </div>

      {/* PlaySummer ตรงกลาง พร้อม logo.png ด้านหน้า */}
      <div className="navbar-center">
        <Link to="/" className="playsummer-link">
          <img 
            src={logo} 
            alt="Sun" 
            className="sun-icon" 
            onError={(e) => (e.target.src = 'https://via.placeholder.com/80?text=Sun')}
          />
          <h1 className="playsummer-title">PlaySummer</h1>
        </Link>
      </div>

      {/* ไอคอนตะกร้าและแอดมินด้านขวา */}
      <div className="icon-container">
        <Link to="/cart" className="icon-link">
          <img 
            src={cartIcon} 
            alt="Cart" 
            className="icon cart-icon" 
            onError={(e) => (e.target.src = 'https://via.placeholder.com/42?text=Cart')}
          />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        <Link to="/admin" className="icon-link">
          <img 
            src={adminIcon} 
            alt="Admin" 
            className="icon admin-icon" 
            onError={(e) => (e.target.src = 'https://via.placeholder.com/42?text=Admin')}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
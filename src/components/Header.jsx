import React from 'react';
import { Link, NavLink } from 'react-router-dom';

// Fallback images ในกรณีที่ไฟล์ PNG โหลดไม่สำเร็จ
const fallbackSunIcon = 'https://via.placeholder.com/80?text=Sun';
const fallbackCartIcon = 'https://via.placeholder.com/42?text=Cart';
const fallbackAdminIcon = 'https://via.placeholder.com/42?text=Admin';

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

      {/* PlaySummer ตรงกลาง พร้อม sun.png ด้านหน้า */}
      <div className="navbar-center">
        <Link to="/" className="playsummer-link">
          <img 
            src="public/sun.png" 
            alt="Sun" 
            className="sun-icon" 
            onError={(e) => (e.target.src = fallbackSunIcon)} // เพิ่ม fallback
          />
          <h1 className="playsummer-title">PlaySummer</h1>
        </Link>
      </div>

      {/* ไอคอนตะกร้าและแอดมินด้านขวา */}
      <div className="icon-container">
        <Link to="/cart" className="icon-link">
          <img 
            src="public/cart-icon.png" 
            alt="Cart" 
            className="icon cart-icon" 
            onError={(e) => (e.target.src = fallbackCartIcon)} // เพิ่ม fallback
          />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        <Link to="/admin" className="icon-link">
          <img 
            src="public/admin-icon.png" 
            alt="Admin" 
            className="icon admin-icon" 
            onError={(e) => (e.target.src = fallbackAdminIcon)} // เพิ่ม fallback
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
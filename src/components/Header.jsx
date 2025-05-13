import React from 'react';
import { Link, NavLink } from 'react-router-dom';

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
          <img src="/sun.png" alt="Sun" className="sun-icon" />
          <h1 className="playsummer-title">PlaySummer</h1>
        </Link>
      </div>

      {/* ไอคอนตะกร้าและแอดมินด้านขวา */}
      <div className="icon-container">
        <Link to="/cart" className="icon-link">
          <img src="/cart-icon.png" alt="Cart" className="icon cart-icon" />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
        <Link to="/admin" className="icon-link">
          <img src="/admin-icon.png" alt="Admin" className="icon admin-icon" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
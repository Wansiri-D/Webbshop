import React from 'react';
import { Link } from 'react-router-dom';
import cartIcon from '../assets/cart-icon.png';
import adminIcon from '../assets/admin-icon.png';

const Header = ({ cartCount }) => {
  return (
    <header className="navbar flex justify-between items-center">
      {/* มุมซ้าย: ปุ่ม Products */}
      <Link to="/products" className="products-btn">
        Products
      </Link>

      {/* ตรงกลาง: ข้อความ PlaySummer */}
      <Link to="/">
        <h1 className="playsummer-title">PlaySummer</h1>
      </Link>

      {/* มุมขวา: ไอคอนตะกร้าและแอดมิน */}
      <div className="flex items-center">
        <Link to="/cart" className="icon-container">
          <img src={cartIcon} alt="Cart" className="h-[42px] w-[42px] object-contain icon" />
          {cartCount > 0 && (
            <span className="cart-count">
              {cartCount}
            </span>
          )}
        </Link>
        <Link to="/admin" className="icon-container">
          <img src={adminIcon} alt="Admin" className="h-[42px] w-[42px] object-contain icon" />
        </Link>
      </div>
    </header>
  );
};

export default Header;
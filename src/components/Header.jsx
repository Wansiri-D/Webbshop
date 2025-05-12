import React from 'react';
import { Link } from 'react-router-dom';

const Header = ({ cartCount }) => {
  return (
    <header className="navbar flex justify-between items-center">
      <Link to="/">
        <h1 className="text-white">PlaySummer</h1>
      </Link>
      <nav>
        <Link to="/" className="text-white mx-4">Home</Link>
        <Link to="/products" className="text-white mx-4">Products</Link>
        <Link to="/cart" className="text-white mx-4">
          Cart ({cartCount})
        </Link>
      </nav>
    </header>
  );
};

export default Header;
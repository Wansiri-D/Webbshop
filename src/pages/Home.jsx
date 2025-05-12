import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ addToCart }) => {
  const products = [
    { id: 1, name: 'Beach Ball', price: 150, image: '/assets/beach-ball.jpg' },
    { id: 2, name: 'Water Gun', price: 200, image: '/assets/water-gun.jpg' },
    { id: 3, name: 'Frisbee', price: 100, image: '/assets/frisbee.jpg' },
    { id: 4, name: 'Sand Bucket', price: 120, image: '/assets/sand-bucket.jpg' },
  ];

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Welcome to PlaySummer!</h1>
        <p className="hero-subtitle">Discover the Best Summer Toys for Endless Fun!</p>
        <Link to="/products">
          <button className="hero-cta">Shop Now</button>
        </Link>
      </div>

      {/* รายการสินค้า - 4 ช่องใน 1 แถว */}
      <div className="product-grid">
        {products.map((product, index) => (
          <div key={product.id} className={`product-card ${index % 2 === 0 ? 'bg-white' : 'bg-yellow-50'}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover rounded"
            />
            <h2>{product.name}</h2>
            <button
              className="orange add-to-cart-btn"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
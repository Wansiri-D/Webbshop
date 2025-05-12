import React from 'react';
import { Link } from 'react-router-dom';
import newProductImage1 from '../assets/new-product.jpg';
import newProductImage2 from '../assets/new-product2.jpg';
import newProductImage3 from '../assets/new-product3.jpg';

const Home = ({ addToCart }) => {
  const newProducts = [
    {
      id: 21,
      name: 'New Summer Splash',
      price: 250,
      description: 'A fun water toy perfect for summer adventures! Enjoy endless splashing fun with this durable and colorful splash toy.',
      image: newProductImage1,
    },
    {
      id: 22,
      name: 'Super Beach Blaster',
      price: 300,
      description: 'A powerful water blaster for epic beach battles! Made with high-quality materials for long-lasting fun.',
      image: newProductImage2,
    },
    {
      id: 23,
      name: 'Mega Sand Sculptor',
      price: 180,
      description: 'Create amazing sand sculptures with this all-in-one kit! Perfect for kids and families at the beach.',
      image: newProductImage3,
    },
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

      {/* New Arrival Section 1 (Image on Left, Details on Right) */}
      <div className="new-arrival-section">
        <div className="new-arrival-image-container">
          <img
            src={newProducts[0].image}
            alt={newProducts[0].name}
            className="new-arrival-image"
          />
          <span className="new-arrival-badge">NEW!</span>
        </div>
        <div className="new-arrival-details">
          <h2>{newProducts[0].name}</h2>
          <p className="promotional-header">{newProducts[0].price} SEK</p>
          <p>{newProducts[0].description}</p>
          <button
            className="orange add-to-cart-btn"
            onClick={() => addToCart(newProducts[0])}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* New Arrival Section 2 (Details on Left, Image on Right) */}
      <div className="new-arrival-section">
        <div className="new-arrival-details">
          <h2>{newProducts[1].name}</h2>
          <p className="promotional-header">{newProducts[1].price} SEK</p>
          <p>{newProducts[1].description}</p>
          <button
            className="orange add-to-cart-btn"
            onClick={() => addToCart(newProducts[1])}
          >
            Add to Cart
          </button>
        </div>
        <div className="new-arrival-image-container">
          <img
            src={newProducts[1].image}
            alt={newProducts[1].name}
            className="new-arrival-image"
          />
          <span className="new-arrival-badge">NEW!</span>
        </div>
      </div>

      {/* New Arrival Section 3 (Image on Left, Details on Right) */}
      <div className="new-arrival-section">
        <div className="new-arrival-image-container">
          <img
            src={newProducts[2].image}
            alt={newProducts[2].name}
            className="new-arrival-image"
          />
          <span className="new-arrival-badge">NEW!</span>
        </div>
        <div className="new-arrival-details">
          <h2>{newProducts[2].name}</h2>
          <p className="promotional-header">{newProducts[2].price} SEK</p>
          <p>{newProducts[2].description}</p>
          <button
            className="orange add-to-cart-btn"
            onClick={() => addToCart(newProducts[2])}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
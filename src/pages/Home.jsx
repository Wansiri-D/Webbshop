import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
      <div className="bg-yellow-300 p-4 text-center">
        <h1 className="promotional-header">New Arrivals!</h1>
        <p>Explore the latest summer toys for endless fun!</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4">
        <div className="product-card">
          <img
            src="/assets/beach-ball.jpg"
            alt="Beach Ball"
            className="w-full h-48 object-cover rounded"
          />
          <h2>Beach Balls</h2>
          <Link to="/products">
            <button className="yellow">View More</button>
          </Link>
        </div>
        <div className="product-card">
          <img
            src="/assets/water-gun.jpg"
            alt="Water Gun"
            className="w-full h-48 object-cover rounded"
          />
          <h2>Water Guns</h2>
          <Link to="/products">
            <button className="yellow">View More</button>
          </Link>
        </div>
        <div className="product-card">
          <img
            src="/assets/frisbee.jpg"
            alt="Frisbee"
            className="w-full h-48 object-cover rounded"
          />
          <h2>Frisbees</h2>
          <Link to="/products">
            <button className="yellow">View More</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
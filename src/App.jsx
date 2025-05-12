import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import CartPage from './pages/CartPage.jsx';
import Order from './pages/Order.jsx';
import Footer from './components/Footer.jsx';

const App = () => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Mock data (in real app, fetch from Firestore)
  useEffect(() => {
    const mockProducts = [
      { id: 1, name: 'Beach Ball', price: 150, category: 'Beach Toys', image: 'beach-ball.jpg' },
      { id: 2, name: 'Water Gun', price: 200, category: 'Water Games', image: 'water-gun.jpg' },
      { id: 3, name: 'Frisbee', price: 100, category: 'Outdoor Fun', image: 'frisbee.jpg' },
      { id: 4, name: 'Sand Bucket', price: 120, category: 'Beach Toys', image: 'sand-bucket.jpg' },
      { id: 5, name: 'Inflatable Float', price: 300, category: 'Water Games', image: 'float.jpg' },
      { id: 6, name: 'Kite', price: 180, category: 'Outdoor Fun', image: 'kite.jpg' },
      { id: 7, name: 'Snorkel Set', price: 250, category: 'Water Games', image: 'snorkel.jpg' },
      { id: 8, name: 'Sand Mold Kit', price: 90, category: 'Beach Toys', image: 'sand-mold.jpg' },
      { id: 9, name: 'Beach Paddle Set', price: 140, category: 'Beach Toys', image: 'paddle.jpg' },
      { id: 10, name: 'Water Balloon Kit', price: 80, category: 'Water Games', image: 'water-balloon.jpg' },
      { id: 11, name: 'Flying Disc', price: 110, category: 'Outdoor Fun', image: 'disc.jpg' },
      { id: 12, name: 'Beach Tent', price: 400, category: 'Beach Toys', image: 'tent.jpg' },
      { id: 13, name: 'Dive Rings', price: 130, category: 'Water Games', image: 'dive-rings.jpg' },
      { id: 14, name: 'Bouncy Ball', price: 60, category: 'Outdoor Fun', image: 'bouncy-ball.jpg' },
      { id: 15, name: 'Sand Castle Kit', price: 150, category: 'Beach Toys', image: 'sand-castle.jpg' },
      { id: 16, name: 'Floating Noodle', price: 90, category: 'Water Games', image: 'noodle.jpg' },
      { id: 17, name: 'Hula Hoop', price: 120, category: 'Outdoor Fun', image: 'hula-hoop.jpg' },
      { id: 18, name: 'Beach Umbrella', price: 350, category: 'Beach Toys', image: 'umbrella.jpg' },
      { id: 19, name: 'Water Sprinkler', price: 220, category: 'Water Games', image: 'sprinkler.jpg' },
      { id: 20, name: 'Jump Rope', price: 70, category: 'Outdoor Fun', image: 'jump-rope.jpg' },
    ];
    setProducts(mockProducts);
  }, []);

  const addToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleCheckout = () => {
    navigate('/order');
    setCartItems([]);
  };

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalCartItems} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route
            path="/products"
            element={<Products products={products} addToCart={addToCart} />}
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                handleCheckout={handleCheckout}
              />
            }
          />
          <Route path="/order" element={<Order />} />
          <Route path="/admin" element={<div>Admin Page (Under Construction)</div>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
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
      { id: 1, name: 'Beach Ball', price: 150, image: 'beach-ball.jpg' },
      { id: 2, name: 'Water Gun', price: 200, image: 'water-gun.jpg' },
      { id: 3, name: 'Frisbee', price: 100, image: 'frisbee.jpg' },
      { id: 4, name: 'Sand Bucket', price: 120, image: 'sand-bucket.jpg' },
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

  // คำนวณจำนวนสินค้าทั้งหมดโดยรวม quantity
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
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import CartPage from './pages/CartPage.jsx';
import Order from './pages/Order.jsx';
import Admin from './pages/Admin.jsx';

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  const addToCart = (product) => {
    // ดีบัก: ตรวจสอบข้อมูล product ที่ส่งเข้ามา
    console.log('Adding to cart:', product);

    // ตรวจสอบว่า product มี docId หรือไม่
    if (!product.docId) {
      console.error('Product does not have a docId:', product);
      return;
    }

    // อัพเดต cartItems โดยใช้ functional update เพื่อให้แน่ใจว่าอัพเดตจาก state ล่าสุด
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.docId === product.docId);
      let updatedItems;
      if (existingItem) {
        updatedItems = prevItems.map((item) =>
          item.docId === product.docId ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedItems = [...prevItems, { ...product, quantity: 1 }];
      }

      // ดีบัก: ตรวจสอบ docId ซ้ำใน cartItems
      const docIds = updatedItems.map(item => item.docId);
      const hasDuplicateDocIds = new Set(docIds).size !== docIds.length;
      if (hasDuplicateDocIds) {
        console.warn('Duplicate docIds found in cartItems:', docIds);
      }

      console.log('Updated cartItems:', updatedItems);
      return updatedItems;
    });
  };

  const removeFromCart = (itemDocId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.docId !== itemDocId);
      console.log('Updated cartItems after remove:', updatedItems);
      return updatedItems;
    });
  };

  const updateQuantity = (itemDocId, delta) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.docId === itemDocId
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      );
      console.log('Updated cartItems after update quantity:', updatedItems);
      return updatedItems;
    });
  };

  const handleCheckout = () => {
    console.log('handleCheckout called at:', new Date().toISOString());
    navigate('/order');
    setCartItems([]);
  };

  // ดีบัก: ตรวจสอบ cartItems หลังจากการอัพเดต state
  useEffect(() => {
    if (cartItems.length > 0) {
      const docIds = cartItems.map(item => item.docId);
      const hasDuplicateDocIds = new Set(docIds).size !== docIds.length;
      if (hasDuplicateDocIds) {
        console.warn('Duplicate docIds found in cartItems after render:', docIds);
      }
      console.log('Current cartItems after render:', cartItems);
    }
  }, [cartItems]);

  const totalCartItems = cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalCartItems} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route
            path="/products"
            element={<Products addToCart={addToCart} />}
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
          <Route path="/admin/*" element={<Admin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
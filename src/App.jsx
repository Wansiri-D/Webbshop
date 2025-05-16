import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import CartPage from './pages/CartPage.jsx';
import Order from './pages/Order.jsx';
import Admin from './pages/Admin.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';

// คอมโพเนนต์ Modal สำหรับแจ้งเตือน
const NotificationModal = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '18px', color: '#4A4A4A', marginBottom: '20px' }}>
          {message}
        </p>
        <button
          style={{
            backgroundColor: '#FF865E',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const App = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); // เพิ่ม state เพื่อตรวจสอบว่าเป็นแอดมินหรือไม่
  const [notification, setNotification] = useState(null); // เพิ่ม state สำหรับแจ้งเตือน
  const navigate = useNavigate();

  const addToCart = (product) => {
    // ดีบัก: ตรวจสอบข้อมูล product ที่ส่งเข้ามา
    console.log('Adding to cart:', product);

    // ตรวจสอบว่า product มี docId หรือไม่
    if (!product.docId) {
      console.error('Product does not have a docId:', product);
      setNotification('Sorry, we couldn\'t add the product to cart. Please try again. 😓');
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
      setNotification('Yay! Product added to cart successfully! 🎉');
      return updatedItems;
    });
  };

  const removeFromCart = (itemDocId) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.docId !== itemDocId);
      console.log('Updated cartItems after remove:', updatedItems);
      setNotification('Product removed from cart successfully! 🗑️');
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
    setNotification('Checkout successful! Your order has been placed. 🎉');
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

  // ฟังก์ชันสำหรับปิด Modal
  const closeNotification = () => {
    setNotification(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header cartCount={totalCartItems} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home addToCart={addToCart} setNotification={setNotification} />} />
          <Route
            path="/products"
            element={<Products addToCart={addToCart} setNotification={setNotification} />}
          />
          <Route
            path="/cart"
            element={
              <CartPage
                cartItems={cartItems}
                removeFromCart={removeFromCart}
                updateQuantity={updateQuantity}
                handleCheckout={handleCheckout}
                setNotification={setNotification}
              />
            }
          />
          <Route path="/order" element={<Order />} />
          <Route
            path="/admin/login"
            element={<AdminLogin setIsAdmin={setIsAdmin} setNotification={setNotification} />}
          />
          <Route
            path="/admin/*"
            element={isAdmin ? <Admin /> : <AdminLogin setIsAdmin={setIsAdmin} setNotification={setNotification} />}
          />
        </Routes>
      </main>
      <Footer />
      <NotificationModal message={notification} onClose={closeNotification} />
    </div>
  );
};

export default App;
import React from 'react';
import { Link } from 'react-router-dom';

const CartPage = ({ cartItems, removeFromCart, updateQuantity, handleCheckout }) => {
  // ดีบัก: ตรวจสอบว่า component ถูกเรียกในบริบทที่ถูกต้อง
  console.log('CartPage component rendered at:', new Date().toISOString());

  // ดีบัก: ตรวจสอบว่า cartItems มีค่าถูกต้องหรือไม่
  console.log('Cart items:', cartItems);

  // ดีบัก: ตรวจสอบว่า handleCheckout ถูกส่งมาใน props หรือไม่
  console.log('handleCheckout function:', handleCheckout);

  // กรอง cartItems เพื่อให้แน่ใจว่าเฉพาะรายการที่มี docId เท่านั้นที่ถูก render
  const validCartItems = cartItems.filter(item => item.docId);

  // ดีบัก: ตรวจสอบ docId ของแต่ละรายการ
  const docIds = validCartItems.map(item => item.docId);
  console.log('docIds in cart:', docIds);
  const hasDuplicateDocIds = new Set(docIds).size !== docIds.length;
  if (hasDuplicateDocIds) {
    console.warn('Duplicate docIds found in cart:', docIds);
  }

  // คำนวณจำนวนสินค้าทั้งหมด
  const totalItems = validCartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  // คำนวณราคารวม
  const totalPrice = validCartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);

  // ดีบัก: ตรวจสอบการคำนวณยอดรวม
  console.log('Cart summary:', { totalItems, totalPrice });

  // ฟังก์ชันสำหรับดีบักเมื่อคลิกปุ่ม Checkout
  const onCheckoutClick = () => {
    console.log('Checkout button clicked at:', new Date().toISOString());
    if (handleCheckout) {
      handleCheckout();
    } else {
      console.error('handleCheckout is not defined');
    }
  };

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      {validCartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {validCartItems.map((item, index) => {
              // ดีบัก: ตรวจสอบค่า quantity ของแต่ละรายการ
              console.log(`Item ${item.name || 'Unknown Product'} quantity:`, item.quantity);

              // ใช้ docId เป็น key แต่เพิ่ม index เพื่อป้องกันการซ้ำ
              const uniqueKey = `${item.docId}-${index}`;

              // คำนวณยอดรวมของสินค้าชิ้นนี้ (ราคาชิ้นเดียว x จำนวน)
              const itemTotalPrice = (item.price || 0) * (item.quantity || 0);

              return (
                <div 
                  key={uniqueKey} 
                  className="cart-item"
                  style={{
                    display: 'flex !important',
                    alignItems: 'center !important',
                    gap: '5rem !important', // เพิ่มระยะห่างระหว่างรูปภาพและชื่อ/ราคา
                    marginBottom: '1rem !important',
                  }}
                >
                  <img 
                    src={item.imageUrl} 
                    alt={item.name || 'Product Image'} 
                    style={{
                      width: '80px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '0.25rem',
                    }} 
                  />
                  <div className="cart-item-details" style={{ flex: '1 !important' }}>
                    <h2>{item.name || 'Unknown Product'}</h2>
                    <p className="promotional-header">
                      {(item.price || 0)} SEK
                      {item.quantity > 1 && (
                        <span className="item-total">
                          {' '}x {item.quantity} = {itemTotalPrice.toFixed(2)} SEK
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="cart-item-actions">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.docId, -1)}
                      disabled={(item.quantity || 0) <= 1}
                      style={{
                        padding: '0.5rem 1rem !important',
                        borderRadius: '0.25rem',
                        transition: 'all 0.3s !important',
                        backgroundColor: '#FF865E !important',
                        color: '#FFFFFF !important',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.2)';
                        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity || 0}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => updateQuantity(item.docId, 1)}
                      style={{
                        padding: '0.5rem 1rem !important',
                        borderRadius: '0.25rem',
                        transition: 'all 0.3s !important',
                        backgroundColor: '#FF865E !important',
                        color: '#FFFFFF !important',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      +
                    </button>
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item.docId)}
                      style={{
                        padding: '0.5rem 1rem !important',
                        borderRadius: '0.25rem',
                        transition: 'all 0.3s !important',
                        backgroundColor: '#FF865E !important',
                        color: '#FFFFFF !important',
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div 
            style={{
              backgroundColor: '#ffedd5 !important',
              padding: '1.25rem !important',
              borderRadius: '0.5rem !important',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1) !important',
              display: 'flex !important',
              flexDirection: 'column !important',
              alignItems: 'center !important',
              justifyContent: 'center !important',
              gap: '1.25rem !important',
              marginTop: '1.5rem !important',
              marginBottom: '1.5rem !important',
              margin: '0 auto !important', // จัดกึ่งกลางในแนวนอน
              textAlign: 'center !important',
              width: '100% !important', // ให้ความกว้างครอบคลุม container
              maxWidth: '600px !important', // จำกัดความกว้างสูงสุดเพื่อให้สมดุล
            }}
          >
            <p 
              style={{
                color: '#c2410c',
                fontSize: '1.25rem',
                fontWeight: 500,
              }}
            >
              Total Items: {totalItems}
            </p>
            <p 
              style={{
                color: '#c2410c',
                fontSize: '1.5rem',
                fontWeight: 500,
              }}
            >
              Total: {totalPrice.toFixed(2)} SEK
            </p>
            <button 
              style={{
                backgroundColor: '#10b981',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '0.25rem',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.1)';
                e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
              onClick={onCheckoutClick}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
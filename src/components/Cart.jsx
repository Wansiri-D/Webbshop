import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems = [], updateQuantity, removeFromCart, handleCheckout }) => {
  // ดีบัก: ตรวจสอบว่า component ถูกเรียกในบริบทที่ถูกต้อง
  console.log('Cart component rendered at:', new Date().toISOString());

  // ดีบัก: ตรวจสอบว่า cartItems มีค่าถูกต้องหรือไม่
  console.log('Cart items:', cartItems);

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

  // คำนวณจำนวนประเภทสินค้า (unique items)
  const totalTypes = validCartItems.length;

  // คำนวณราคารวม
  const totalPrice = validCartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);

  // ดีบัก: ตรวจสอบการคำนวณยอดรวม
  console.log('Cart summary:', { totalItems, totalTypes, totalPrice });

  // ตรวจสอบว่าตะกร้าว่างหรือไม่
  if (!validCartItems || validCartItems.length === 0) {
    return (
      <div className="cart-page">
        <p className="empty-cart">Your cart is empty.</p>
        <Link to="/products">
          <button className="checkout-btn">Continue Shopping</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {validCartItems.map((item, index) => {
          // ใช้ docId เป็น key แต่เพิ่ม index เพื่อป้องกันการซ้ำ
          const uniqueKey = `${item.docId}-${index}`;

          return (
            <div key={uniqueKey} className="cart-item">
              <div className="cart-item-details">
                <h2>{item.name || 'Unknown Product'}</h2>
                <p>Price: {(item.price || 0)} SEK</p>
                <p>Quantity: {(item.quantity || 0)}</p>
              </div>
              <div className="cart-item-actions">
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.docId, -1)}
                  disabled={(item.quantity || 0) <= 1}
                >
                  -
                </button>
                <span className="quantity">{item.quantity || 0}</span>
                <button
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.docId, 1)}
                >
                  +
                </button>
                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.docId)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="cart-checkout">
        <p>Total Items: {totalItems} ({totalTypes} types)</p>
        <p>Total Price: {totalPrice.toFixed(2)} SEK</p>
        <button className="checkout-btn" onClick={handleCheckout}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
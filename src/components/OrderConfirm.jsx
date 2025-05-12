import React from 'react';
import { Link } from 'react-router-dom';

const OrderConfirm = () => {
  return (
    <div className="order-confirm">
      <h1>Order Confirmed!</h1>
      <p>Thank you for your order. We'll send a confirmation email soon.</p>
      <Link to="/">
        <button className="green">Back to Home</button>
      </Link>
    </div>
  );
};

export default OrderConfirm;
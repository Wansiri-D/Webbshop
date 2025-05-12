import React from 'react';
import Cart from '../components/Cart.jsx';

const CartPage = ({ cartItems, removeFromCart, updateQuantity, handleCheckout }) => {
  return (
    <Cart
      cartItems={cartItems}
      removeFromCart={removeFromCart}
      updateQuantity={updateQuantity}
      handleCheckout={handleCheckout}
    />
  );
};

export default CartPage;
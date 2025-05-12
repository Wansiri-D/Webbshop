import React from 'react';

const Cart = ({ cartItems, removeFromCart, updateQuantity, handleCheckout }) => {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <h2>{item.name}</h2>
                <p>{item.price} SEK x {item.quantity}</p>
              </div>
              <div className="flex items-center">
                <button
                  className="yellow mx-2"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  className="yellow mx-2"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  +
                </button>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <div className="mt-4">
            <h2>Total: {total} SEK</h2>
            <button className="green" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
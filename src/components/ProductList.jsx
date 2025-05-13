import React from 'react';

const ProductList = ({ products, addToCart }) => {
  return (
    <div className="products-grid">
      {products.map((product) => (
        <div key={product.docId} className="product-card">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
          <h2>{product.name}</h2>
          <p className="promotional-header">{product.price} SEK</p>
          <button
            className="orange add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
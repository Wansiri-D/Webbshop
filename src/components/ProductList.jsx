import React from 'react';

const ProductList = ({ products, addToCart }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <img
            src={`/assets/${product.image}`}
            alt={product.name}
            className="w-full h-48 object-cover rounded"
          />
          <h2>{product.name}</h2>
          <p className="promotional-header">{product.price} SEK</p>
          <button onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
import React from 'react';

const ProductList = ({ products, addToCart }) => {
  // จำกัดจำนวนสินค้าที่แสดงไว้ที่ 20 ชิ้น (4 ชิ้น x 5 แถว)
  const displayedProducts = products.slice(0, 20);

  return (
    <div className="products-grid">
      {displayedProducts.map((product) => (
        <div key={product.id} className="product-card">
          <img
            src={`/assets/${product.image}`}
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
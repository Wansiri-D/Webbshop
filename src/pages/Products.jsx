import React from 'react';
import ProductList from '../components/ProductList.jsx';

const Products = ({ products, addToCart }) => {
  return (
    <div>
      <h1>Summer Toys</h1>
      <ProductList products={products} addToCart={addToCart} />
    </div>
  );
};

export default Products;
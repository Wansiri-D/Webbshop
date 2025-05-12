import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import ProductList from '../components/ProductList.jsx';

const Products = ({ products, addToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState('default');

  // อัพเดท filteredProducts เมื่อ products เปลี่ยน
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // ค้นหาเมื่อ searchTerm เปลี่ยน
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const fuse = new Fuse(products, {
        keys: ['name', 'category'],
        threshold: 0.3, // ความแม่นยำของการค้นหา
        ignoreCase: true, // ไม่สนใจตัวพิมพ์ใหญ่-เล็ก
      });
      const result = fuse.search(searchTerm).map((item) => item.item);
      setFilteredProducts(result);
    }
  }, [searchTerm, products]);

  // เรียงลำดับเมื่อ sortOption เปลี่ยน
  useEffect(() => {
    let sortedProducts = [...filteredProducts];
    if (sortOption === 'name-asc') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === 'name-desc') {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === 'price-asc') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'price-desc') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(sortedProducts);
  }, [sortOption]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="products-page">
      <h1>Summer Toys</h1>
      <div className="products-controls">
        <input
          type="text"
          placeholder="Search by name or category..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <select value={sortOption} onChange={handleSortChange} className="sort-select">
          <option value="default">Sort By</option>
          <option value="name-asc">Name (A-Z)</option>
          <option value="name-desc">Name (Z-A)</option>
          <option value="price-asc">Price (Low to High)</option>
          <option value="price-desc">Price (High to Low)</option>
        </select>
      </div>
      <ProductList products={filteredProducts} addToCart={addToCart} />
    </div>
  );
};

export default Products;
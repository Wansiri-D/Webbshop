import React, { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import ProductList from '../components/ProductList.jsx';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Products = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState('default');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          docId: doc.id
        }));
        setProducts(productsList);
        setFilteredProducts(productsList);
      } catch (e) {
        console.error("Error fetching products: ", e);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const fuse = new Fuse(products, {
        keys: ['name', 'category'],
        threshold: 0.3,
        ignoreCase: true,
      });
      const result = fuse.search(searchTerm).map((item) => item.item);
      setFilteredProducts(result);
    }
  }, [searchTerm, products]);

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      {products.length > 0 ? (
        <ProductList products={filteredProducts} addToCart={addToCart} />
      ) : (
        <p>Loading products...</p>
      )}

      <div className="back-to-top-container">
        <button onClick={scrollToTop} className="back-to-top-btn">
          Back to Top <span className="back-to-top-arrow">↑</span>
        </button>
      </div>
    </div>
  );
};

export default Products;
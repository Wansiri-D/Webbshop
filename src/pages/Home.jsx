import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Home = ({ addToCart }) => {
  const [newProducts, setNewProducts] = useState([]);

  // ดึงข้อมูลสินค้าจาก Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          docId: doc.id // เก็บ docId เพื่อใช้ในการแก้ไข/ลบในอนาคต
        }));
        // กรองเฉพาะสินค้าที่เป็น New Arrival (สมมติว่าเราจะแสดง 3 รายการล่าสุด)
        setNewProducts(productsList.slice(-3));
      } catch (e) {
        console.error("Error fetching products: ", e);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">Welcome to PlaySummer!</h1>
        <p className="hero-subtitle">Discover the Best Summer Toys for Endless Fun!</p>
      </div>

      {/* แสดงสินค้า New Arrival */}
      {newProducts.length > 0 ? (
        newProducts.map((product, index) => (
          <div key={product.docId} className="new-arrival-section">
            {index % 2 === 0 ? (
              <>
                <div className="new-arrival-image-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="new-arrival-image"
                  />
                  <span className="new-arrival-badge">NEW!</span>
                </div>
                <div className="new-arrival-details">
                  <h2>{product.name}</h2>
                  <p className="promotional-header">{product.price} SEK</p>
                  <p>{product.description}</p>
                  <button
                    className="orange add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="new-arrival-details">
                  <h2>{product.name}</h2>
                  <p className="promotional-header">{product.price} SEK</p>
                  <p>{product.description}</p>
                  <button
                    className="orange add-to-cart-btn"
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
                <div className="new-arrival-image-container">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="new-arrival-image"
                  />
                  <span className="new-arrival-badge">NEW!</span>
                </div>
              </>
            )}
          </div>
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
};

export default Home;
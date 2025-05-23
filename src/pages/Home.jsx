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
        // กรองเฉพาะสินค้าที่เป็น New Arrival (แสดง 4 รายการล่าสุด)
        setNewProducts(productsList.slice(-4));
      } catch (e) {
        console.error("Error fetching products: ", e);
      }
    };
    fetchProducts();
  }, []);

  // ฟังก์ชันสำหรับเลื่อนกลับไปด้านบน
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
                  <p>{product.description}</p>
                </div>
              </>
            ) : (
              <>
                <div className="new-arrival-details">
                  <h2>{product.name}</h2>
                  <p>{product.description}</p>
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

      {/* ปุ่ม More Products */}
      <div className="view-more-container">
        <Link to="/products">
          <button className="view-more-btn">More Products</button>
        </Link>
      </div>

      {/* ปุ่ม Back to Top */}
      <div className="back-to-top-container">
        <button onClick={scrollToTop} className="back-to-top-btn">
          Back to Top <span className="back-to-top-arrow">↑</span>
        </button>
      </div>
    </div>
  );
};

export default Home;
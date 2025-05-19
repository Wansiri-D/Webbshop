import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const AdminDashboard = ({ setNotification }) => {
  const [totalProducts, setTotalProducts] = useState(0);

  // ดึงจำนวนสินค้าทั้งหมดจาก Firestore
  useEffect(() => {
    let isMounted = true;

    const fetchTotalProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        if (isMounted) {
          setTotalProducts(querySnapshot.size);
        }
      } catch (e) {
        console.error("Error fetching total products: ", e);
        if (isMounted) {
          setNotification('Sorry, we couldn\'t load the total products. 😓');
        }
      }
    };
    fetchTotalProducts();

    return () => {
      isMounted = false;
    };
  }, [setNotification]);

  return (
    <div className="admin-page">
      <h2 className="dashboard-title">Welcome Admin!</h2>
      <p className="dashboard-stats">Total Products: {totalProducts}</p>
      <p className="dashboard-tip">Tip: Add new products regularly to keep your store fresh!</p>
    </div>
  );
};

export default AdminDashboard;
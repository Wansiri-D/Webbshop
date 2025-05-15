import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// คอมโพเนนต์ ConfirmModal สำหรับยืนยันการลบ
const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  if (!message) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '18px', color: '#4A4A4A', marginBottom: '20px' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            style={{
              backgroundColor: '#FF865E',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button
            style={{
              backgroundColor: '#666666',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const EditProducts = ({ setNotification }) => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // ดึงข้อมูลสินค้าจาก Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsList = querySnapshot.docs.map(doc => ({
          docId: doc.id,
          ...doc.data(),
        }));
        setProducts(productsList);
      } catch (e) {
        setNotification('Failed to fetch products.');
        console.error("Error fetching products: ", e);
      }
    };
    fetchProducts();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setUpdatedProduct({
      name: product.name,
      price: product.price,
      description: product.description,
    });
    setNewImage(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setNotification('Please select an image file (e.g., JPEG, PNG).');
        setNewImage(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setNotification('Image size must be less than 2MB.');
        setNewImage(null);
        return;
      }
      setNewImage(file);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingProduct.imageUrl;

      if (newImage) {
        const oldImageRef = ref(storage, editingProduct.imageUrl);
        await deleteObject(oldImageRef).catch((e) => {
          console.warn("Failed to delete old image:", e);
        });

        const newImageRef = ref(storage, `products/${Date.now()}_${newImage.name}`);
        await uploadBytes(newImageRef, newImage);
        imageUrl = await getDownloadURL(newImageRef);
      }

      const productRef = doc(db, "products", editingProduct.docId);
      await updateDoc(productRef, {
        name: updatedProduct.name,
        price: parseFloat(updatedProduct.price),
        description: updatedProduct.description,
        imageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
      });

      setProducts(products.map(p => 
        p.docId === editingProduct.docId 
          ? { ...p, ...updatedProduct, imageUrl, price: parseFloat(updatedProduct.price) } 
          : p
      ));

      setNotification('Product updated successfully!');
      setEditingProduct(null);
      setNewImage(null);
    } catch (e) {
      setNotification(e.message || 'Failed to update product.');
      console.error("Error updating product: ", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const imageRef = ref(storage, productToDelete.imageUrl);
      await deleteObject(imageRef).catch((e) => {
        console.warn("Failed to delete image:", e);
      });

      const productRef = doc(db, "products", productToDelete.docId);
      await deleteDoc(productRef);

      setProducts(products.filter(p => p.docId !== productToDelete.docId));
      setNotification('Product deleted successfully!');
    } catch (e) {
      setNotification(e.message || 'Failed to delete product.');
      console.error("Error deleting product: ", e);
    } finally {
      setLoading(false);
      setShowConfirmModal(false);
      setProductToDelete(null);
    }
  };

  const initiateDelete = (product) => {
    setProductToDelete(product);
    setShowConfirmModal(true);
  };

  const cancelDelete = () => {
    setShowConfirmModal(false);
    setProductToDelete(null);
  };

  return (
    <div className="admin-page">
      <h1>Edit Products</h1>

      {editingProduct ? (
        <div className="edit-form">
          <h2>Edit Product: {editingProduct.name}</h2>
          <form onSubmit={handleUpdate} className="admin-form">
            <div className="form-group">
              <label htmlFor="name">Product Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedProduct.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price (SEK):</label>
              <input
                type="number"
                id="price"
                name="price"
                value={updatedProduct.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={updatedProduct.description}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="image">New Product Image (Max 2MB, optional):</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              <p>Current Image: <a href={editingProduct.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></p>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Updating Product...' : 'Update Product'}
              </button>
              <button
                type="button"
                className="cancel-btn"
                onClick={() => setEditingProduct(null)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <>
          {products.length > 0 ? (
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Price (SEK)</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.docId}>
                    <td>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="product-image-small"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td>{product.description}</td>
                    <td className="action-buttons">
                      <button
                        className="edit-btn"
                        onClick={() => handleEditClick(product)}
                        disabled={loading}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => initiateDelete(product)}
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No products available.</p>
          )}
        </>
      )}

      {/* แสดง Modal สำหรับยืนยันการลบ */}
      <ConfirmModal
        message={productToDelete ? `Are you sure you want to delete ${productToDelete.name}?` : null}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default EditProducts;
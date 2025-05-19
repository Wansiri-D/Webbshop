import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

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
    imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

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
        setNotification('Sorry, we couldn\'t load the products. Please try again later. 😓');
        console.error("Error fetching products: ", e);
        if (e.code === 'permission-denied') {
          setNotification('It seems you don\'t have permission to view products. Please check Firebase settings or contact support. 🙏');
        } else if (e.code === 'unavailable') {
          setNotification('Oh no! It looks like your network is unavailable. Please check your internet connection and try again. 📶');
        }
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
      imageUrl: product.imageUrl,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateImageUrl = (url) => {
    if (!url) return true;
    const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
    return imageExtensions.test(url);
  };

  const validateForm = () => {
    if (updatedProduct.name.length < 5) {
      setNotification('Product Name must be at least 5 characters long. 😓');
      return false;
    }

    const priceValue = parseFloat(updatedProduct.price);
    if (isNaN(priceValue) || priceValue <= 0 || !Number.isInteger(priceValue)) {
      setNotification('Price must be a positive integer. 😓');
      return false;
    }

    if (updatedProduct.description.length < 10) {
      setNotification('Description must be at least 10 characters long. 😓');
      return false;
    }

    if (updatedProduct.imageUrl && !validateImageUrl(updatedProduct.imageUrl)) {
      setNotification('Oops! It looks like the image URL isn\'t valid. Please use a link ending with .jpg, .png, .jpeg, or .gif. 😊');
      return false;
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const productRef = doc(db, "products", editingProduct.docId);
      await updateDoc(productRef, {
        name: updatedProduct.name,
        price: parseFloat(updatedProduct.price),
        description: updatedProduct.description,
        imageUrl: updatedProduct.imageUrl || editingProduct.imageUrl,
        updatedAt: new Date().toISOString(),
      });

      setProducts(products.map(p => 
        p.docId === editingProduct.docId 
          ? { ...p, ...updatedProduct, price: parseFloat(updatedProduct.price), imageUrl: updatedProduct.imageUrl || editingProduct.imageUrl } 
          : p
      ));

      setNotification('Yay! Your product has been updated successfully! 🎉');
      setEditingProduct(null);
    } catch (e) {
      setNotification(e.message || 'Sorry, we couldn\'t update the product. Please try again later. 😓');
      console.error("Error updating product: ", e);
      if (e.code === 'permission-denied') {
        setNotification('It seems you don\'t have permission to update this product. Please check Firebase settings or contact support. 🙏');
      } else if (e.code === 'unavailable') {
        setNotification('Oh no! It looks like your network is unavailable. Please check your internet connection and try again. 📶');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);

    try {
      const productRef = doc(db, "products", productToDelete.docId);
      await deleteDoc(productRef);

      setProducts(products.filter(p => p.docId !== productToDelete.docId));
      setNotification('Product deleted successfully! 🗑️');
    } catch (e) {
      setNotification(e.message || 'Sorry, we couldn\'t delete the product. Please try again later. 😓');
      console.error("Error deleting product: ", e);
      if (e.code === 'permission-denied') {
        setNotification('It seems you don\'t have permission to delete this product. Please check Firebase settings or contact support. 🙏');
      } else if (e.code === 'unavailable') {
        setNotification('Oh no! It looks like your network is unavailable. Please check your internet connection and try again. 📶');
      }
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="admin-page">
      <h1>Edit Products</h1>

      {editingProduct ? (
        <div className="edit-form">
          <h2>{editingProduct.name}</h2>
          <form onSubmit={handleUpdate} className="admin-form edit-product-form">
            <div className="form-group">
              <label htmlFor="name">Product Name: <span className="required-asterisk">*</span></label>
              <input
                type="text"
                id="name"
                name="name"
                value={updatedProduct.name}
                onChange={handleInputChange}
                placeholder="Must be at least 5 characters long"
                required
                minLength={5}
                title="Product Name must be at least 5 characters long."
              />
            </div>
            <div className="form-group">
              <label htmlFor="price">Price (SEK): <span className="required-asterisk">*</span></label>
              <input
                type="number"
                id="price"
                name="price"
                value={updatedProduct.price}
                onChange={handleInputChange}
                placeholder="Must be a positive integer"
                required
                min="1"
                step="1"
                title="Price must be a positive integer."
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description: <span className="required-asterisk">*</span></label>
              <textarea
                id="description"
                name="description"
                value={updatedProduct.description}
                onChange={handleInputChange}
                placeholder="Must be at least 10 characters long"
                required
                minLength={10}
                title="Description must be at least 10 characters long."
              />
            </div>
            <div className="form-group">
              <label htmlFor="imageUrl">Product Image URL (optional):</label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={updatedProduct.imageUrl}
                onChange={handleInputChange}
                placeholder="Must be a valid URL (e.g., https://example.com/image.jpg) if provided"
              />
              <p>Current Image: <a href={editingProduct.imageUrl} target="_blank" rel="noopener noreferrer">View Image</a></p>
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Updating...' : 'Update'}
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

      <ConfirmModal
        message={productToDelete ? `Are you sure you want to delete ${productToDelete.name}?` : null}
        onConfirm={handleDelete}
        onCancel={cancelDelete}
      />

      <div className="back-to-top-container">
        <button onClick={scrollToTop} className="back-to-top-btn">
          Back to Top <span className="back-to-top-arrow">↑</span>
        </button>
      </div>
    </div>
  );
};

export default EditProducts;
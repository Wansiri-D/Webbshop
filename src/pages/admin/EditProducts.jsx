import React, { useState, useEffect } from 'react';
import { db, storage } from '../../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const EditProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
        setError('Failed to fetch products.');
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
    setError('');
    setSuccess('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
    setSuccess('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (e.g., JPEG, PNG).');
        setNewImage(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB.');
        setNewImage(null);
        return;
      }
      setNewImage(file);
      setError('');
      setSuccess('');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      let imageUrl = editingProduct.imageUrl;

      // ถ้ามีรูปภาพใหม่ ให้อัพโหลดและลบรูปภาพเก่า
      if (newImage) {
        // ลบรูปภาพเก่า
        const oldImageRef = ref(storage, editingProduct.imageUrl);
        await deleteObject(oldImageRef).catch((e) => {
          console.warn("Failed to delete old image:", e);
        });

        // อัพโหลดรูปภาพใหม่
        const newImageRef = ref(storage, `products/${Date.now()}_${newImage.name}`);
        await uploadBytes(newImageRef, newImage);
        imageUrl = await getDownloadURL(newImageRef);
      }

      // อัพเดทข้อมูลสินค้าใน Firestore
      const productRef = doc(db, "products", editingProduct.docId);
      await updateDoc(productRef, {
        name: updatedProduct.name,
        price: parseFloat(updatedProduct.price),
        description: updatedProduct.description,
        imageUrl: imageUrl,
        updatedAt: new Date().toISOString(),
      });

      // อัพเดทรายการสินค้าใน state
      setProducts(products.map(p => 
        p.docId === editingProduct.docId 
          ? { ...p, ...updatedProduct, imageUrl, price: parseFloat(updatedProduct.price) } 
          : p
      ));

      setSuccess('Product updated successfully!');
      setEditingProduct(null);
      setNewImage(null);
    } catch (e) {
      setError(e.message || 'Failed to update product.');
      console.error("Error updating product: ", e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;

    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // ลบรูปภาพจาก Cloud Storage
      const imageRef = ref(storage, product.imageUrl);
      await deleteObject(imageRef).catch((e) => {
        console.warn("Failed to delete image:", e);
      });

      // ลบข้อมูลสินค้าจาก Firestore
      const productRef = doc(db, "products", product.docId);
      await deleteDoc(productRef);

      // อัพเดทรายการสินค้าใน state
      setProducts(products.filter(p => p.docId !== product.docId));
      setSuccess('Product deleted successfully!');
    } catch (e) {
      setError(e.message || 'Failed to delete product.');
      console.error("Error deleting product: ", e);
    } finally {
      setLoading(false);
    }
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
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
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
                  <th></th> {/* ลบข้อความ "Actions" */}
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
                        onClick={() => handleDelete(product)}
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
          {success && <p className="success">{success}</p>}
          {error && <p className="error">{error}</p>}
        </>
      )}
    </div>
  );
};

export default EditProducts;
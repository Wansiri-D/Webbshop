import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Admin = () => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
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
        setImage(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB.');
        setImage(null);
        return;
      }
      setImage(file);
      setError('');
      setSuccess('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // อัพโหลดรูปภาพไปยัง Cloud Storage
      console.log('Uploading image:', image.name);
      const imageRef = ref(storage, `products/${Date.now()}_${image.name}`);
      const uploadTask = await uploadBytes(imageRef, image);
      console.log('Image uploaded successfully:', uploadTask.metadata.fullPath);

      // ดึง URL ของรูปภาพ
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Image URL:', imageUrl);

      // เพิ่มข้อมูลสินค้าลง Firestore
      console.log('Adding product to Firestore:', product);
      const docRef = await addDoc(collection(db, "products"), {
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      });
      console.log('Product added successfully with ID:', docRef.id);

      setSuccess('Product added successfully!');
      setProduct({ name: '', price: '', description: '' });
      setImage(null);
      document.getElementById('image').value = '';
    } catch (e) {
      const errorMessage = e.message || 'Failed to add product. Please try again.';
      setError(errorMessage);
      console.error("Error adding product: ", e);
      if (e.code === 'permission-denied') {
        setError('Permission denied. Please check Firebase Security Rules.');
      } else if (e.code === 'storage/unauthorized') {
        setError('Unauthorized access to Storage. Please check Storage Rules.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">
      <h1>Add New Product</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <div className="form-group">
          <label htmlFor="name">Product Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
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
            value={product.price}
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
            value={product.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="image">Product Image (Max 2MB):</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading || !image}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
        {success && <p className="success">{success}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default Admin;
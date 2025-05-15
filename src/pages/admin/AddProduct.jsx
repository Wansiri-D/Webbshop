import React, { useState, useRef } from 'react';
import { db, storage } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AddProduct = ({ setNotification }) => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  // ใช้ useRef เพื่อเข้าถึง input file
  const imageInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    setProgress('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setNotification('Please select an image file (e.g., JPEG, PNG).');
        setImage(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setNotification('Image size must be less than 2MB.');
        setImage(null);
        return;
      }
      setImage(file);
      setProgress('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProgress('Uploading image...');

    try {
      console.log('Uploading image:', image.name);
      const imageRef = ref(storage, `products/${Date.now()}_${image.name}`);
      const uploadTask = await uploadBytes(imageRef, image);
      console.log('Image uploaded successfully:', uploadTask.metadata.fullPath);

      setProgress('Getting image URL...');
      const imageUrl = await getDownloadURL(imageRef);
      console.log('Image URL:', imageUrl);

      setProgress('Saving product...');
      console.log('Adding product to Firestore:', product);
      const docRef = await addDoc(collection(db, "products"), {
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      });
      console.log('Product added successfully with ID:', docRef.id);

      setNotification('Product added successfully!');
      setProduct({ name: '', price: '', description: '' });
      setImage(null);
      // รีเซ็ต input file ด้วย useRef แทนการใช้ DOM Manipulation
      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }
      setProgress('');
    } catch (e) {
      const errorMessage = e.message || 'Failed to add product. Please try again.';
      setNotification(errorMessage);
      console.error("Error adding product: ", e);
      if (e.code === 'permission-denied') {
        setNotification('Permission denied. Please check Firebase Security Rules.');
      } else if (e.code === 'storage/unauthorized') {
        setNotification('Unauthorized access to Storage. Please check Storage Rules.');
      } else if (e.code === 'unavailable') {
        setNotification('Network unavailable. Please check your internet connection.');
      }
      setProgress('');
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
            ref={imageInputRef} // ใช้ ref เพื่อเข้าถึง input
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading || !image}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
        {progress && <p className="progress">{progress}</p>}
      </form>
    </div>
  );
};

export default AddProduct;
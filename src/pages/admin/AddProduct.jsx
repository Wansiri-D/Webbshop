import React, { useState } from 'react';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

const AddProduct = ({ setNotification }) => {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
  });
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
    setProgress('');
  };

  const handleImageUrlChange = (e) => {
    setImageUrl(e.target.value);
    setProgress('');
  };

  const validateImageUrl = (url) => {
    const imageExtensions = /\.(jpg|jpeg|png|gif)$/i;
    return imageExtensions.test(url);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบ URL รูปภาพ
    if (!validateImageUrl(imageUrl)) {
      setNotification('Oops! It looks like the image URL isn\'t valid. Please use a link ending with .jpg, .png, .jpeg, or .gif. 😊');
      return;
    }

    setLoading(true);
    setProgress('Saving product...');

    try {
      console.log('Adding product to Firestore:', product);
      const docRef = await addDoc(collection(db, "products"), {
        name: product.name,
        price: parseFloat(product.price),
        description: product.description,
        imageUrl: imageUrl,
        createdAt: new Date().toISOString(),
      });
      console.log('Product added successfully with ID:', docRef.id);

      setNotification('Yay! Your product has been added successfully! 🎉');
      setProduct({ name: '', price: '', description: '' });
      setImageUrl('');
      setProgress('');
    } catch (e) {
      const errorMessage = e.message || 'Sorry, we couldn\'t add the product. Please try again later. 😓';
      setNotification(errorMessage);
      console.error("Error adding product: ", e);
      if (e.code === 'permission-denied') {
        setNotification('It seems you don\'t have permission to add this product. Please check Firebase settings or contact support. 🙏');
      } else if (e.code === 'unavailable') {
        setNotification('Oh no! It looks like your network is unavailable. Please check your internet connection and try again. 📶');
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
          <label htmlFor="imageUrl">Product Image URL:</label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Adding Product...' : 'Add Product'}
        </button>
        {progress && <p className="progress">{progress}</p>}
      </form>
    </div>
  );
};

export default AddProduct;
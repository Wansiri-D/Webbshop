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

  const validateForm = () => {
    if (product.name.length < 5) {
      setNotification('Product Name must be at least 5 characters long. 😓');
      return false;
    }

    const priceValue = parseFloat(product.price);
    if (isNaN(priceValue) || priceValue <= 0 || !Number.isInteger(priceValue)) {
      setNotification('Price must be a positive integer. 😓');
      return false;
    }

    if (product.description.length < 10) {
      setNotification('Description must be at least 10 characters long. 😓');
      return false;
    }

    if (!imageUrl) {
      setNotification('Product Image URL is required. 😓');
      return false;
    }
    if (!validateImageUrl(imageUrl)) {
      setNotification('Oops! It looks like the image URL isn\'t valid. Please use a link ending with .jpg, .png, .jpeg, or .gif. 😊');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
          <label htmlFor="name">Product Name: <span className="required-asterisk">*</span></label>
          <input
            type="text"
            id="name"
            name="name"
            value={product.name}
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
            value={product.price}
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
            value={product.description}
            onChange={handleInputChange}
            placeholder="Must be at least 10 characters long"
            required
            minLength={10}
            title="Description must be at least 10 characters long."
          />
        </div>
        <div className="form-group">
          <label htmlFor="imageUrl">Product Image URL: <span className="required-asterisk">*</span></label>
          <input
            type="url"
            id="imageUrl"
            name="imageUrl"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="Must be a valid URL (e.g., https://example.com/image.jpg)"
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
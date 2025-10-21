import React, { useState, useEffect } from 'react';
import API from '../api/AxiosConfig';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const AddRestaurant = () => {
  const [restaurant, setRestaurant] = useState({ name: '', address: '' });
  const [ownerId, setOwnerId] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "New Restaurant";
    API.get('/user/me')
      .then(res => {
        setOwnerId(res.data.id);
        setUsername(res.data.username);
      })
      .catch(err => console.error('Failed to fetch user:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurant(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!ownerId || !username) {
      alert('User information not loaded yet.');
      return;
    }

    const payload = { ...restaurant, ownerId };

    API.post('/restaurants', payload)
      .then(res => {
        const newRestaurantId = res.data.id;
        alert('Restaurant added successfully!');
        navigate(`/owner/restaurant/${newRestaurantId}/profile`);
      })
      .catch(err => {
        console.error('Error adding restaurant:', err);
        alert('Failed to add restaurant');
      });
  };

  return (
    <center>
      <div className="form-card">
        <h2 className="form-title">Add New Restaurant</h2>
        <form onSubmit={handleSubmit} className="add-restaurant-form">
          <input
            type="text"
            name="name"
            placeholder="Restaurant Name"
            value={restaurant.name}
            onChange={handleChange}
            className="form-input"
            required
          />
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={restaurant.address}
            onChange={handleChange}
            className="form-input"
            required
          />
          <button type="submit" className="submit-button">Add Restaurant</button>
        </form>
      </div>
    </center>
  );
};

export default AddRestaurant;
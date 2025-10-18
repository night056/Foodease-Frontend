import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import { jwtDecode } from 'jwt-decode';
import '../styles.css';

const OwnerRestaurantProfile = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const username = decoded.sub;

  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/restaurants/${restaurantId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setRestaurant(res.data);
        setForm({
          name: res.data.name,
          address: res.data.address,
          description: res.data.description || '',
        });
      })
      .catch((err) => console.error('Error fetching restaurant:', err));
  }, [restaurantId, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    API.put(`/restaurants/${restaurantId}`, form, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setRestaurant(res.data);
        setEditMode(false);
        alert('Restaurant updated successfully!');
      })
      .catch((err) => {
        console.error('Update failed:', err);
        alert('Failed to update restaurant.');
      });
  };

  const handleViewMenu = () => {
    navigate(`/owner/restaurant/${restaurantId}/menu`);
  };

  if (!restaurant) return <p>Loading restaurant profile...</p>;

  return (
    <>
      <Navbar role="owner" username={username} />
      <div className="profile-card">
        <h3>Restaurant Profile</h3>

        {editMode ? (
          <>
            <label>Name:</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-input"
            />

            <label>Address:</label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="form-input"
            />

            <label>Description:</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-input"
            />

            <div className="profile-actions">
              <button className="submit-button" onClick={handleUpdate}>
                Save
              </button>
              <button className="explore-button" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Name:</strong> {restaurant.name}</p>
            <p><strong>Address:</strong> {restaurant.address}</p>
            <p><strong>Description:</strong> {restaurant.description || 'N/A'}</p>

            <div className="profile-actions">
              <button className="submit-button" onClick={() => setEditMode(true)}>
                Edit Details
              </button>
              <button className="explore-button" onClick={handleViewMenu}>
                View Menu
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default OwnerRestaurantProfile;
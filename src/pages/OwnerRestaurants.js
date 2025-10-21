import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const OwnerRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const ownerId = decoded.id;
  const username = decoded.sub;

  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/restaurants/owner/${ownerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching owner restaurants:', err);
        setError('Failed to load restaurants.');
        setLoading(false);
      });
  }, [ownerId, token]);

  const handleRestaurantClick = (id) => {
    navigate(`/restaurant/${id}/details`);
  };



  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await API.delete(`/restaurants/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants((prev) => prev.filter((r) => r.id !== id));
        alert('Restaurant deleted successfully.');
      } catch (err) {
        console.error('Delete failed:', err);
        alert('Failed to delete restaurant.');
      }
    }
  };

  return (
    <>
      <Navbar role="owner" username={username} />
      <div className="dashboard-content">
        <h2 className="form-title">🏬 Your Restaurants</h2>

        {loading ? (
          <p>Loading your restaurants...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : restaurants.length === 0 ? (
          <p>You haven't added any restaurants yet.</p>
        ) : (
          <div className="restaurant-grid">
            {restaurants.map((r) => (
              <div key={r.id} className="card restaurant-card">
                <div className="restaurant-info" onClick={() => navigate(`/owner/restaurant/${r.id}/profile`)}>
                  <h3>{r.name}</h3>
                  <p>{r.address}</p>
                </div>
                <div className="restaurant-actions">

                  <button className="submit-button" onClick={() => handleDelete(r.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OwnerRestaurants;
import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const OwnerOrders = () => {
  const [restaurants, setRestaurants] = useState([]);
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const username = decoded.sub;
  const ownerId=decoded.id;
  const navigate = useNavigate();

  useEffect(() => {
  API.get(`/restaurants/owner/${ownerId}`)
    .then((res) => setRestaurants(res.data))
    .catch((err) => console.error('Error fetching restaurants:', err));
}, [ownerId]);

  const handleViewOrders = (restaurantId) => {
    navigate(`/owner/restaurant/${restaurantId}/orders`);
  };

  return (
    <>
      <Navbar role="owner" username={username} />
      <div className="dashboard-content">
        <h2>🏨 Your Restaurants</h2>
        {restaurants.length === 0 ? (
          <p>No restaurants found.</p>
        ) : (
          <ul>
            {restaurants.map((r) => (
              <li key={r.id}>
                <strong>{r.name}</strong> — {r.location}
                <br />
                <button
                  className="explore-button"
                  onClick={() => handleViewOrders(r.id)}
                >
                  View Orders
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default OwnerOrders;
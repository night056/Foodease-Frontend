import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';

const RestaurantDetails = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingMessage, setRatingMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/restaurants/${restaurantId}`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error('Error fetching restaurant:', err));
  }, [restaurantId]);

  useEffect(() => {
    if (restaurant) {
      document.title = `${restaurant.name} | FoodEase`;
    }
  }, [restaurant]);

  const handleViewMenu = () => {
    API.get(`/menu-items/restaurant/${restaurantId}`)
      .then(res => {
        setMenuItems(res.data);
        setShowMenu(true);
      })
      .catch(err => console.error('Error fetching menu items:', err));
  };

  const handleRatingSubmit = async () => {
    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await API.post(`/restaurants/${restaurantId}/rate`, { score: rating }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRatingMessage('✅ Rating submitted successfully!');
      setTimeout(() => setRatingMessage(''), 3000);
    } catch (err) {
      console.error('Error submitting rating:', err);
      alert('Failed to submit rating. Please try again.');
    }
  };

  if (!restaurant) return <p>Loading restaurant details...</p>;

  return (
    <>
      <Navbar role="customer" username={localStorage.getItem('username')} />
      <div className="restaurant-details-container">
        <div className="card restaurant-info-card">
          <h2>{restaurant.name}</h2>
          <p><strong>📍 Address:</strong> {restaurant.address}</p>
          <p><strong>⭐ Rating:</strong> {restaurant.rating || 'Not rated yet'}</p>

          {/* Rating Section */}
          <div className="rating-section">
            <label htmlFor="rating">Rate this restaurant:</label>
            <select
              id="rating"
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value))}
            >
              <option value="0">Select</option>
              {[1, 2, 3, 4, 5].map(score => (
                <option key={score} value={score}>{score} ⭐</option>
              ))}
            </select>
            <button className="submit-button" onClick={handleRatingSubmit}>
              Submit Rating
            </button>
            {ratingMessage && <p className="success-message">{ratingMessage}</p>}
          </div>

          {!showMenu && (
            <button className="explore-button" onClick={handleViewMenu}>
              View Menu
            </button>
          )}
        </div>

        {showMenu && (
          <div className="card menu-card">
            <h3>🍽️ Menu Items</h3>
            <ul className="menu-list">
              {menuItems.map(item => (
                <li key={item.id} className="menu-item">
                  <strong>{item.name}</strong> - ₹{item.price}
                  <span className={`availability ${item.availability ? 'available' : 'unavailable'}`}>
                    {item.availability ? 'Available' : 'Unavailable'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <button className="submit-button" onClick={() => navigate(`/restaurant/${restaurantId}/order`)}>
          Order Food
        </button>
      </div>
    </>
  );
};

export default RestaurantDetails;
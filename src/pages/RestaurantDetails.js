import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';
import { useNavigate } from 'react-router-dom';



const RestaurantDetails = () => {
  const { restaurantId } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [menuItems, setMenuItems] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    API.get(`/restaurants/${restaurantId}`)
      .then(res => setRestaurant(res.data))
      .catch(err => console.error('Error fetching restaurant:', err));
  }, [restaurantId]);

  const handleViewMenu = () => {
    API.get(`/menu-items/restaurant/${restaurantId}`)
      .then(res => {
        setMenuItems(res.data);
        setShowMenu(true);
      })
      .catch(err => console.error('Error fetching menu items:', err));
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
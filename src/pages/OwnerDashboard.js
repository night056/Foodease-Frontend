import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';

const OwnerDashboard = () => {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
   

  useEffect(() => {
    document.title = "Home";
    API.get('/user/me')
      .then(res => {
        const userData = res.data;
        setUser(userData);

        if (userData.id) {
          return API.get(`/restaurants/owner/${userData.id}`);
        } else {
          throw new Error('User ID is undefined');
        }
      })
      .then(res => setRestaurants(res.data))
      .catch(err => console.error('Error fetching user or restaurants:', err));
  }, []);

  const handleRestaurantSelect = (id) => {
    navigate(`/restaurant/${id}/details`);
  };

  if (!user) return <p>Loading dashboard...</p>;

  return (
    <>
      <Navbar role="owner" username={user.username} />
      <center>
      <div className="banner-container">
          
          <img
              src="/images/food-banner.jpg"
              alt="FoodEase"></img>
              <br></br>
              <br></br>
            <button className="explore-button" onClick={() => navigate('/owner/restaurants')}>
              View Restaurants
            </button>
            <br></br>
            <br></br>
            <button className="explore-button" onClick={() => navigate('/owner/incoming-orders')}>
                View Incoming Orders
            </button>

        </div>
        </center>
      
      
    </>
  );
};

export default OwnerDashboard;
import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const CustomerDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeOrder, setActiveOrder] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const customerId = decoded.id;

  useEffect(() => {
    API.get('/user/me')
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

    API.get(`/orders/customer/${customerId}/current`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setActiveOrder(res.data))
      .catch(err => {
        if (err.response?.status !== 404) {
          console.error('Error fetching active order:', err);
        }
      });
  }, [customerId, token]);

  const handleViewOrder = () => {
    navigate(`/order/status?orderId=${activeOrder.orderId}`);
  };

  return (
    <>
      <Navbar role="customer" username={user?.username} />
      <center>
        <div className="banner-container">
          <img
            src="/images/food-banner.jpg"
            alt="FoodEase"></img>
          <br></br>
          <br></br>
          <button className="explore-button" onClick={() => navigate('/browse')}>
            Explore Restaurants
          </button>
        </div>

      </center>

      {activeOrder && (
        <div className="card active-order-card">
          <h3>🧾 Active Order</h3>
          <p><strong>Order ID:</strong> {activeOrder.orderId}</p>
          <p><strong>Status:</strong> {activeOrder.status}</p>
          <p><strong>Total:</strong> ₹{activeOrder.totalAmt}</p>
          <button className="explore-button" onClick={handleViewOrder}>
            View Order
          </button>
        </div>
      )}
    </>
  );
};

export default CustomerDashboard;
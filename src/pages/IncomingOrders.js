import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const IncomingOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const username = decoded.sub;
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/orders/owner/pending', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setOrders(res.data))
      .catch(err => console.error('Error fetching incoming orders:', err));
  }, [token]);

  const handleViewDetails = (orderId) => {
    navigate(`/owner/order/${orderId}/details`);
  };

  return (
    <>
      <Navbar role="owner" username={username} />
      <div className="dashboard-content">
        <h2 className="section-title">Incoming Orders</h2>
        <div className="order-grid">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <h3>Order #{order.id}</h3>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ₹{order.totalAmt}</p>
              <button className="submit-button" onClick={() => handleViewDetails(order.id)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default IncomingOrders;
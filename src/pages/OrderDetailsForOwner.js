import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import { jwtDecode } from 'jwt-decode';

const OrderDetailsForOwner = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const username = decoded.sub;
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setOrder(res.data))
      .catch(err => console.error('Error fetching order details:', err));
  }, [orderId, token]);

  const handleApprove = () => {
    API.put(`/orders/${orderId}/approve`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert('Order approved!');
        navigate('/owner/incoming-orders');
      })
      .catch(err => alert('Failed to approve order'));
  };

  const handleCancel = () => {
    API.put(`/orders/${orderId}/cancel`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert('Order cancelled!');
        navigate('/owner/incoming-orders');
      })
      .catch(err => alert('Failed to cancel order'));
  };

  if (!order) return <p>Loading order details...</p>;

  return (
    <>
      <Navbar role="owner" username={username} />
      <div className="dashboard-content">
        <h2>Order #{order.id}</h2>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmt}</p>
        <h3>Items:</h3>
        <ul>
          {order.items.map(item => (
            <li key={item.id}>
              {item.name} x {item.quantity} - ₹{item.price}
            </li>
          ))}
        </ul>
        <button onClick={handleApprove}>Approve</button>
        <button onClick={handleCancel}>Cancel</button>
      </div>
    </>
  );
};

export default OrderDetailsForOwner;
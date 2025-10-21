import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import { jwtDecode } from 'jwt-decode';
import '../styles.css';

const OwnerOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const username = decoded.sub;
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/orders/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching order details:', err);
        setLoading(false);
      });
  }, [orderId, token]);

  const handleApprove = () => {
    API.put(`/orders/${orderId}/approve`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        alert('Order approved successfully!');
        navigate('/owner/incoming-orders');
      })
      .catch(err => {
        console.error('Error approving order:', err);
        alert('Failed to approve order.');
      });
  };

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <>
      <Navbar role="owner" username={username} />
      <div className="dashboard-content">
        <h2 className="section-title">Order #{order.orderId} Details</h2>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total Amount:</strong> ₹{order.totalAmt}</p>

        <h3>Items</h3>
        <ul className="order-items-list">
          {order.items.map((item, index) => (
            <li key={index}>
              <strong>{item.name}</strong> - Qty: {item.quantity} - ₹{item.price}
            </li>
          ))}
        </ul>

        {order.status === 'PENDING' && (
          <button className="submit-button" onClick={handleApprove}>
            Approve Order
          </button>
        )}
      </div>
    </>
  );
};

export default OwnerOrderDetails;
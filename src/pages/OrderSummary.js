import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import '../styles.css';

const OrderSummary = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const customerId = decoded.id;
  const username = decoded.sub;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    API.get(`/orders/customer/${customerId}/current`, { headers })
      .then(res => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching order summary:', err);
        setLoading(false);
      });
  }, [customerId]);

  const handlePlaceOrder = () => {
    API.post(`/orders/${orderId}/place`, {}, { headers })
      .then(() => {
        alert('Order placed successfully!');
        navigate(`/dashboard/customer/${username}`);
      })
      .catch(err => {
        console.error('Error placing order:', err);
        alert('Failed to place order.');
      });
  };

  if (loading) return <p>Loading order summary...</p>;
  if (!order) return <p>No active order found.</p>;

  return (
    <>
      <Navbar role="customer" username={username} />
      <div className="order-summary-card">
        <h2 className="form-title">🧾 Order Summary</h2>
        <ul className="order-items-list">
          {order.items.map(item => (
            <li key={item.id}>
              {item.name} - ₹{item.price} × {item.quantity}
            </li>
          ))}
        </ul>
        <p><strong>Total Amount:</strong> ₹{order.totalAmt}</p>
        <button className="submit-button" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>
    </>
  );
};

export default OrderSummary;
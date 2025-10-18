import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';

const OrderStatusPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const customerId = decoded.id;
  const username = decoded.sub;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    API.get(`/orders/customer/${customerId}`, { headers })
      .then(res => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setLoading(false);
      });
  }, [customerId]);

  const handleCancelOrder = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/cancel`, {}, { headers });
      alert('Order cancelled successfully!');
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status: 'CANCELLED' } : o));
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order.');
    }
  };

  if (loading) return <p>Loading your orders...</p>;

  return (
    <>
      <Navbar role="customer" username={username} />
      <div className="order-status-page">
        <h2 className="form-title">📦 Your Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <div className="order-grid">
            {orders.map(order => (
              <div key={order.orderId} className="card order-card">
                <h3>Order #{order.orderId}</h3>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ₹{order.totalAmt}</p>
                <ul>
                  {order.items.map(item => (
                    <li key={item.id}>
                      {item.name} × {item.quantity} - ₹{item.price}
                    </li>
                  ))}
                </ul>
                {order.status === 'PENDING' && (
                  <button className="explore-button" onClick={() => handleCancelOrder(order.orderId)}>
                    Cancel Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderStatusPage;
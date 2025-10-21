import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';
import { useNavigate } from 'react-router-dom';

const OrderStatusPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const customerId = decoded.id;
  const username = decoded.sub;
  const headers = { Authorization: `Bearer ${token}` };
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Your orders";
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

  useEffect(() => {
    let filtered = orders;
    switch (filter) {
      case 'PENDING':
        filtered = orders.filter(o => o.status === 'PENDING');
        break;
      case 'ACTIVE':
        filtered = orders.filter(o => o.status === 'CONFIRMED');
        break;
      case 'DELIVERED':
        filtered = orders.filter(o => o.status === 'DELIVERED');
        break;
      case 'CANCELLED':
        filtered = orders.filter(o => o.status === 'CANCELLED');
        break;
      case 'ALL':
      default:
        filtered = orders; // includes DRAFT too
        break;
    }
    setFilteredOrders(filtered);
  }, [filter, orders]);

  const handleCancelOrder = async (orderId) => {
    try {
      await API.put(`/orders/${orderId}/cancel`, {}, { headers });
      alert('Order cancelled successfully!');
      setOrders(prev =>
        prev.map(o => o.orderId === orderId ? { ...o, status: 'CANCELLED' } : o)
      );
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert('Failed to cancel order.');
    }
  };

  const handleTrackDelivery = (orderId) => {
    navigate(`/delivery/track?orderId=${orderId}`);
  };

  if (loading) return <p>Loading your orders...</p>;

  return (
    <>
      <Navbar role="customer" username={username} />
      <div className="order-status-page">
        <h2 className="form-title">📦 Your Orders</h2>

        {/* Filter Buttons */}
        <div className="filter-buttons">
          {['ALL', 'PENDING', 'ACTIVE', 'DELIVERED', 'CANCELLED'].map(type => (
            <button
              key={type}
              className={`filter-btn ${filter === type ? 'active' : ''}`}
              onClick={() => setFilter(type)}
            >
              {type.charAt(0) + type.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <p>No orders found for this filter.</p>
        ) : (
          <div className="order-grid">
            {filteredOrders.map(order => (
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
                  <button
                    className="explore-button"
                    onClick={() => handleCancelOrder(order.orderId)}
                  >
                    Cancel Order
                  </button>
                )}

                {order.status === 'DELIVERED' && (
                  <button
                    className="explore-button"
                    onClick={() => handleTrackDelivery(order.orderId)}
                  >
                    Track Delivery
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
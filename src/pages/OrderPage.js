import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';
import '../styles.css';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';

const OrderPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [orderId, setOrderId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const customerId = decoded.id;
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    API.get(`/menu-items/restaurant/${restaurantId}`)
      .then(res => setMenuItems(res.data))
      .catch(err => console.error('Error fetching menu items:', err));
  }, [restaurantId]);

  const handleQuantityChange = (itemId, value) => {
    setQuantities(prev => ({ ...prev, [itemId]: value }));
  };

  const handleAddToOrder = async (itemId) => {
    const quantity = quantities[itemId];
    if (!quantity || quantity < 1) return alert('Please enter a valid quantity');

    try {
      let currentOrderId = orderId;

      if (!currentOrderId) {
        const res = await API.post('/orders/draft', { restaurantId, customerId }, { headers });
        currentOrderId = res.data.orderId;
        setOrderId(currentOrderId);
      }

      await API.post(`/orders/${currentOrderId}/items`, {
        menuItemId: itemId,
        quantity: quantity
      }, { headers });

      setSuccessMessage('✅ Item successfully added to order!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error adding item to order:', err);
      alert('Failed to add item. Please try again.');
    }
  };

  const handleViewOrder = () => {
    navigate(`/order/${orderId}/summary`);
  };

  return (
    <>
      <Navbar role="customer" username={localStorage.getItem('username')} />
      <div className="order-page">
        <h2 className="form-title">🛒 Select Items to Order</h2>

        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="menu-grid">
          {menuItems.map(item => (
            <div key={item.id} className="card menu-order-card">
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>

              {/* Veg/Non-Veg Label */}
              <p className={`veg-label ${item.isVeg ? 'veg' : 'non-veg'}`}>
                {item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
              </p>

              {/* Availability */}
              <p className={`availability ${item.availability ? 'available' : 'unavailable'}`}>
                {item.availability ? 'Available' : 'Unavailable'}
              </p>

              {item.availability && (
                <div className="order-controls">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={quantities[item.id] || ''}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                  />
                  <button className="explore-button" onClick={() => handleAddToOrder(item.id)}>
                    Add to Order
                  </button>
                </div>
              )}
            </div>
          ))}

        </div>

        {orderId && (
          <button className="submit-button" onClick={handleViewOrder}>
            View Order
          </button>
        )}
      </div>
    </>
  );
};

export default OrderPage;
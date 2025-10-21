import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import { jwtDecode } from 'jwt-decode';
import '../styles.css';

const MyDeliveries = () => {
  const [user, setUser] = useState(null);
  const [deliveries, setDeliveries] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  useEffect(() => {
    API.get('/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

    API.get(`/delivery/partner/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setDeliveries(res.data))
      .catch(err => console.error(err));
  }, [token, userId]);

  const filterDeliveries = () => {
    if (filter === 'CURRENT') {
      return deliveries.filter(d =>
        ['ASSIGNED', 'PICKED_UP', 'ON_THE_WAY'].includes(d.status)
      );
    } else if (filter === 'HISTORY') {
      return deliveries.filter(d => d.status === 'DELIVERED');
    }
    return deliveries;
  };

  const handleStatusUpdate = (deliveryId, status) => {
    API.put(`/delivery/${deliveryId}/status`, null, {
      params: { status },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert(`Status updated to ${status}`);
        setSelectedDelivery(null);
        // Refresh deliveries
        return API.get(`/delivery/partner/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      })
      .then(res => setDeliveries(res.data))
      .catch(err => {
        alert('Failed to update status: ' + (err.response?.data || err.message));
      });
  };

  return (
    <>
      <Navbar role="delivery" username={user?.username} />
      <div className="dashboard-content">
        <h2>📦 My Deliveries</h2>

        <div className="filter-buttons">
          <button onClick={() => setFilter('ALL')} className={filter === 'ALL' ? 'active' : ''}>All</button>
          <button onClick={() => setFilter('CURRENT')} className={filter === 'CURRENT' ? 'active' : ''}>Current</button>
          <button onClick={() => setFilter('HISTORY')} className={filter === 'HISTORY' ? 'active' : ''}>History</button>
        </div>

        {filterDeliveries().length > 0 ? (
          filterDeliveries().map(delivery => (
            <div
              key={delivery.id}
              className={`card ${selectedDelivery?.id === delivery.id ? 'selected' : ''}`}
              onClick={() => setSelectedDelivery(delivery)}
              style={{ cursor: 'pointer' }}
            >
              <p><strong>Order ID:</strong> {delivery.orderId}</p>
              <p><strong>Status:</strong> {delivery.status}</p>
              <p><strong>Assigned At:</strong> {new Date(delivery.assignedAt).toLocaleString()}</p>
              {delivery.deliveredAt && (
                <p><strong>Delivered At:</strong> {new Date(delivery.deliveredAt).toLocaleString()}</p>
              )}

              {selectedDelivery?.id === delivery.id && delivery.status !== 'DELIVERED' && (
                <div className="status-update">
                  <p><strong>Update Status:</strong></p>
                  {delivery.status === 'ASSIGNED' && (
                    <button onClick={() => handleStatusUpdate(delivery.id, 'PICKED_UP')} className="explore-button">Mark as Picked Up</button>
                  )}
                  {delivery.status === 'PICKED_UP' && (
                    <button onClick={() => handleStatusUpdate(delivery.id, 'ON_THE_WAY')} className="explore-button">Mark as On The Way</button>
                  )}
                  {delivery.status === 'ON_THE_WAY' && (
                    <button onClick={() => handleStatusUpdate(delivery.id, 'DELIVERED')} className="explore-button">Mark as Delivered</button>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No deliveries found for this filter.</p>
        )}
      </div>
    </>
  );
};

export default MyDeliveries;
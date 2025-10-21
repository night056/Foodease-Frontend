import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const DeliveryDashboard = () => {
  const [user, setUser] = useState(null);
  const [assignedDelivery, setAssignedDelivery] = useState(null);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.id;

  // Initial fetch
  useEffect(() => {
    API.get('/user/me', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUser(res.data))
      .catch(err => console.error(err));

    API.get(`/delivery/assigned`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log("Assigned delivery response:", res.data);
        // If it's an array, pick the first one
        if (Array.isArray(res.data)) {
          setAssignedDelivery(res.data.length > 0 ? res.data[0] : null);
        } else {
          setAssignedDelivery(res.data || null);
        }
      })
      .catch(err => {
        if (err.response?.status === 404) {
          setAssignedDelivery(null);
        } else {
          console.error('Error fetching assigned delivery:', err);
        }
      });

    fetchAvailableDeliveries();
  }, [token, userId]);

  // Poll available deliveries every 30s if no assigned delivery
  useEffect(() => {
    let interval;
    if (!assignedDelivery) {
      interval = setInterval(() => {
        fetchAvailableDeliveries();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [assignedDelivery]);

  const fetchAvailableDeliveries = () => {
    API.get('/delivery/deliveries/available', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        console.log("Available deliveries:", res.data);
        setAvailableDeliveries(res.data);
      })
      .catch(err => console.error(err));
  };

  const handleAccept = (deliveryId) => {
    API.post(`/delivery/deliveries/${deliveryId}/accept`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert('Delivery accepted!');
        window.location.reload();
      })
      .catch(err => {
        if (err.response?.status === 409) {
          alert('This delivery was already accepted by another partner. Please refresh to see updated deliveries.');
        } else {
          alert('Failed to accept delivery: ' + (err.response?.data || err.message));
        }
      });
  };

  const handleStatusUpdate = (deliveryId, status) => {
    API.put(`/delivery/${deliveryId}/status`, null, {
      params: { status },
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(() => {
        alert(`Status updated to ${status}`);
        window.location.reload();
      })
      .catch(err => {
        alert('Failed to update status: ' + (err.response?.data || err.message));
      });
  };

  return (
    <>
      <Navbar role="delivery" username={user?.username} />

      <h2>Delivery Dashboard</h2>

      {assignedDelivery ? (
        <div className="card active-order-card">
          <h3>🚚 Active Delivery</h3>
          <p><strong>Order ID:</strong> {assignedDelivery.orderId}</p>
          <p><strong>Status:</strong> {assignedDelivery.status}</p>
          <p><strong>Last Updated:</strong>
            {assignedDelivery.lastUpdate
              ? new Date(assignedDelivery.lastUpdate).toLocaleString()
              : 'N/A'}
          </p>
          <div>
            {assignedDelivery.status === 'ASSIGNED' && (
              <button
                className="explore-button"
                onClick={() => handleStatusUpdate(assignedDelivery.deliveryId, 'PICKED_UP')}
              >
                Mark as Picked Up
              </button>
            )}

            {assignedDelivery.status === 'PICKED_UP' && (
              <button
                className="explore-button"
                onClick={() => handleStatusUpdate(assignedDelivery.deliveryId, 'ON_THE_WAY')}
              >
                Mark as On The Way
              </button>
            )}

            {assignedDelivery.status === 'ON_THE_WAY' && (
              <button
                className="explore-button"
                onClick={() => handleStatusUpdate(assignedDelivery.deliveryId, 'DELIVERED')}
              >
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <h3>📦 Available Deliveries</h3>
          {availableDeliveries.length > 0 ? (
            availableDeliveries.map(delivery => (
              <div key={delivery.id} className="card active-order-card">
                <p><strong>Order ID:</strong> {delivery.orderId}</p>
                <p><strong>Status:</strong> {delivery.status}</p>
                <button
                  className="explore-button"
                  onClick={() => handleAccept(delivery.id)}
                >
                  Accept Delivery
                </button>
              </div>
            ))
          ) : (
            <p>No available deliveries at the moment.</p>
          )}
        </>
      )}
    </>
  );
}
export default DeliveryDashboard;
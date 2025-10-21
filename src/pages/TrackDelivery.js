import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';

const TrackDelivery = () => {
  const [delivery, setDelivery] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (orderId) {
      API.get(`/delivery/track/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => {
          setDelivery(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching delivery:', err);
          setLoading(false);
        });
    }
  }, [orderId, token]);

  return (
    <>
      <Navbar role="customer" />
      <div className="track-delivery-page">
        <h2 className="form-title">🚚 Track Your Delivery</h2>
        {loading ? (
          <p>Loading delivery status...</p>
        ) : delivery ? (
          <div className="card">
            <p><strong>Order ID:</strong> {delivery.orderId}</p>
            <p><strong>Delivery Status:</strong> {delivery.status}</p>
            <p><strong>Last Updated:</strong> {new Date(delivery.lastUpdate).toLocaleString()}</p>
            {delivery.deliveredAt && (
              <p><strong>Delivered At:</strong> {new Date(delivery.deliveredAt).toLocaleString()}</p>
            )}
            {delivery.assignedAt && (
              <p><strong>Assigned At:</strong> {new Date(delivery.assignedAt).toLocaleString()}</p>
            )}
            <p><strong>Delivery Partner:</strong> {delivery.deliveryPartnerName}</p>
          </div>
        ) : (
          <p>No delivery information found for this order.</p>
        )}
      </div>
    </>
  );
};

export default TrackDelivery;
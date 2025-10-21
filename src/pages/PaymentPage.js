import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('orderId');

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const [paymentMode, setPaymentMode] = useState('UPI');
  const [processing, setProcessing] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    API.post(`/payment/pay/${orderId}?mode=${paymentMode}`, {}, { headers })
      .then(res => {
        alert(res.data);
        navigate(`/dashboard/customer`);
      })
      .catch(err => {
        console.error('Payment failed:', err);
        alert('Payment failed. Please try again.');
        setProcessing(false);
      });
  };

  return (
    <>
      <Navbar role="customer" />
      <div className="payment-page">
        <h2 className="form-title">💳 Complete Your Payment</h2>
        <p><strong>Order ID:</strong> {orderId}</p>

        <label htmlFor="paymentMode">Select Payment Mode:</label>
        <select
          id="paymentMode"
          value={paymentMode}
          onChange={e => setPaymentMode(e.target.value)}
          className="dropdown"
        >
          <option value="UPI">UPI</option>
          <option value="NETBANKING">Netbanking</option>
          <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
        </select>

        <button
          className="submit-button"
          onClick={handlePayment}
          disabled={processing}
        >
          {processing ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </>
  );
};

export default PaymentPage;
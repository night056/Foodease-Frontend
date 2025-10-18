import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig'; 
import Navbar from '../components/Navbar';

const DeliveryDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get('/user/me')
      .then(res => setUser(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar role="delivery" username={user?.username} />
      <div className="dashboard-content">
        <h1>Welcome, {user?.username}!</h1>
        <p>Phone: {user?.phone}</p>

        <h2>Your Delivery Dashboard</h2>
        <p>Delivery assignment and tracking features will appear here.</p>
      </div>
    </>
  );
};

export default DeliveryDashboard;
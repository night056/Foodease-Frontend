import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig'; 
import Navbar from '../components/Navbar';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/user/me')
      .then(res => {
        setUser(res.data);
        return Promise.all([
          API.get('/restaurants'),
          API.get('/user/all')
        ]);
      })
      .then(([restaurantRes, userRes]) => {
        setRestaurants(restaurantRes.data);
        setUsers(userRes.data);
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <Navbar role="admin" username={user?.username} />
      <div className="dashboard-content">
        <h1>Welcome, {user?.username}!</h1>
        <p>Phone: {user?.phone}</p>

        <h2>All Registered Restaurants</h2>
        <ul>
          {restaurants.map(r => (
            <li key={r.id}>
              {r.name} - {r.address} (Owner ID: {r.owner?.id})
            </li>
          ))}
        </ul>

        <h2>All Users</h2>
        <ul>
          {users.map(u => (
            <li key={u.id}>
              {u.username} - {u.phone} - Roles: {Array.from(u.roles).join(', ')}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default AdminDashboard;

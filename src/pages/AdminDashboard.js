import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showRestaurants, setShowRestaurants] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    document.title = "Home";
    const fetchData = async () => {
      try {
        const userRes = await API.get('/user/me', { headers });
        setUser(userRes.data);

        const [restaurantRes, userRes2, orderRes] = await Promise.all([
          API.get('/restaurants', { headers }),
          API.get('/user/all', { headers }),
          API.get('/orders/admin/all', { headers }) // ✅ Fetch all orders
        ]);

        setRestaurants(Array.isArray(restaurantRes.data) ? restaurantRes.data : []);
        setUsers(Array.isArray(userRes2.data) ? userRes2.data : []);
        setOrders(Array.isArray(orderRes.data) ? orderRes.data : []);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateUserRole = (userId, role) => {
    API.put(`/admin/users/${userId}/role?role=${role}`, {}, { headers })
      .then(() => {
        alert(`Role ${role} added to user ${userId}`);
        return API.get('/user/all', { headers });
      })
      .then(res => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(err => alert('Failed to update role'));
  };

  if (loading) return <p>Loading admin dashboard...</p>;

  return (
    <>
      <Navbar role="admin" username={user?.username} />
      <div className="dashboard-content">
        

        {/* Summary Section */}
        <section>
          <h2>📊 Dashboard Summary</h2>
          <ul>
            <li>Total Restaurants: {restaurants.length}</li>
            <li>Total Users: {users.length}</li>
            <li>Total Orders: {orders.length}</li>
          </ul>
          <div style={{ marginTop: '1rem' }}>
            <button onClick={() => setShowRestaurants(prev => !prev)}>
              {showRestaurants ? 'Hide Restaurants' : 'Show Restaurants'}
            </button>
            <button onClick={() => setShowUsers(prev => !prev)}>
              {showUsers ? 'Hide Users' : 'Show Users'}
            </button>
            <button onClick={() => setShowOrders(prev => !prev)}>
              {showOrders ? 'Hide Orders' : 'Show Orders'}
            </button>
          </div>
        </section>

        {/* Restaurants Section */}
        {showRestaurants && (
          <section>
            <h2>📍 All Registered Restaurants</h2>
            {restaurants.length > 0 ? (
              <ul>
                {restaurants.map(r => (
                  <li key={r.id}>
                    <strong>{r.name}</strong> - {r.address}
                    {r.owner && <> (Owner ID: {r.owner.id})</>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No restaurants found.</p>
            )}
          </section>
        )}

        {/* Users Section */}
        {showUsers && (
          <section>
            <h2>👥 All Users</h2>
            {users.length > 0 ? (
              <ul>
                {users.map(u => (
                  <li key={u.id}>
                    <strong>{u.username}</strong> - {u.phone} <br />
                    Roles: {Array.isArray(u.roles) ? u.roles.join(', ') : 'None'} <br />
                    {!u.roles.includes('OWNER') && (
                      <button onClick={() => updateUserRole(u.id, 'OWNER')}>Make Owner</button>
                    )}
                    {!u.roles.includes('DELIVERY') && (
                      <button onClick={() => updateUserRole(u.id, 'DELIVERY')}>Make Delivery</button>
                    )}
                    {!u.roles.includes('CUSTOMER') && (
                      <button onClick={() => updateUserRole(u.id, 'CUSTOMER')}>Make Customer</button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No users found.</p>
            )}
          </section>
        )}

        {/* Orders Section */}
        {showOrders && (
          <section>
            <h2>🧾 All Orders</h2>
            {orders.length > 0 ? (
              <ul>
                {orders.map(o => (
                  <li key={o.orderId}>
                    <strong>Order #{o.orderId}</strong> - Status: {o.status} <br />
                    Total: ₹{o.totalAmt} <br />
                    Items:
                    <ul>
                      {o.items.map(item => (
                        <li key={item.menuItemId}>
                          {item.name} × {item.quantity} — ₹{item.price}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders found.</p>
            )}
          </section>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles.css';

const Navbar = ({ role, username }) => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">FoodEase</div>
      <ul className="navbar-links">
        <li><Link to={`/dashboard/${role}/${username}`}>Home</Link></li>
        <li><Link to={`/profile/${username}`}>Profile</Link></li>
        {role === 'owner' && (
          <li>
            <Link to="/add-restaurant">Add Restaurant</Link>
            <Link to="/owner/orders">View Orders</Link>
          </li>
        )}
        {role === 'customer' && <li><Link to="/browse">Browse</Link></li>}
        {role === 'delivery' && <li><Link to="/deliveries">My Deliveries</Link></li>}
        {role === 'admin' && <li><Link to="/admin-panel">Admin Panel</Link></li>}
        <li><Link to="/logout">Logout</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
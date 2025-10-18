import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import { jwtDecode } from 'jwt-decode';
import '../styles.css';

const OwnerMenuPage = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const username = decoded.sub;

  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = () => {
    API.get(`/menu-items/restaurant/${restaurantId}`)
      .then(res => setMenuItems(res.data))
      .catch(err => console.error('Error fetching menu items:', err));
  };

  const handleToggleAvailability = (id, current) => {
    API.put(`/menu-items/${id}/availability?available=${!current}`)
      .then(() => fetchMenuItems())
      .catch(err => console.error('Error toggling availability:', err));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this menu item?')) {
      API.delete(`/menu-items/${id}`)
        .then(() => fetchMenuItems())
        .catch(err => console.error('Error deleting item:', err));
    }
  };

  const handleAddItem = () => {
    const payload = { ...newItem, restaurantId: parseInt(restaurantId) };
    API.post('/menu-items', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(() => {
        setNewItem({ name: '', price: '', description: '' });
        fetchMenuItems();
      })
      .catch(err => console.error('Error adding item:', err));
  };

  return (
    <>
      <Navbar role="owner" username={username} />
      <div className="dashboard-content">
        <h2 className="section-title">Menu Items</h2>

        <ul className="menu-list">
          {menuItems.map(item => (
            <li key={item.id} className="menu-item-card">
              <div className="menu-item-details">
                <h4>{item.name} - ₹{item.price}</h4>
                <p>{item.description}</p>
                <p>Status: <strong>{item.availability ? 'Available' : 'Unavailable'}</strong></p>
              </div>
              <div className="menu-actions">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={item.availability}
                    onChange={() => handleToggleAvailability(item.id, item.availability)}
                  />
                  <span className="slider round"></span>
                </label>
                <button className="explore-button" onClick={() => handleDelete(item.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>

        <div className="add-menu-form">
          <h3>Add New Menu Item</h3>
          <input
            className="form-input"
            placeholder="Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          />
          <input
            className="form-input"
            placeholder="Price"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          />
          <textarea
            className="form-input"
            placeholder="Description"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <button className="submit-button" onClick={handleAddItem}>Add Item</button>
        </div>
      </div>
    </>
  );
};

export default OwnerMenuPage;

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';

const AddMenuItems = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();

  const [menuItem, setMenuItem] = useState({
    name: '',
    price: '',
    availability: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMenuItem(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) : value
    }));
  };

  const handleCheckboxChange = () => {
    setMenuItem(prev => ({
      ...prev,
      availability: !prev.availability
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...menuItem,
      restaurant: { id: restaurantId }
    };

    API.post('/menu-items', payload)
      .then(() => {
        alert('Menu item added successfully!');
        setMenuItem({ name: '', price: '', availability: true });
      })
      .catch(err => {
        console.error('Error adding menu item:', err);
        alert('Failed to add menu item');
      });
  };

  const handleFinish = () => {
     navigate(`/restaurant/${restaurantId}/details`);

  };

  return (
    <div className="form-container">
      <h2>Add Menu Item</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={menuItem.name}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={menuItem.price}
          onChange={handleChange}
          required
        />
        <label>
          <input
            type="checkbox"
            checked={menuItem.availability}
            onChange={handleCheckboxChange}
          />
          Available
        </label>
        <button type="submit">Add Item</button>
      </form>
      <button onClick={handleFinish} style={{ marginTop: '1rem' }}>
        Finish & Go to Dashboard
      </button>
    </div>
  );
};

export default AddMenuItems;
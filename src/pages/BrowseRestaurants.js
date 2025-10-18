import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';

const BrowseRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    API.get('/restaurants')
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
  }, []);

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClick = (id) => {
    navigate(`/restaurant/${id}/details`);
  };

  return (
    <>
      <Navbar role="customer" username={localStorage.getItem('username')} />
      <div className="browse-container">
        <h2 className="form-title">🍽️ Search Restaurants</h2>
        <input
          type="text"
          placeholder="Search by name or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <div className="restaurant-grid">
          {filteredRestaurants.map(r => (
            <div key={r.id} className="card restaurant-card" onClick={() => handleClick(r.id)}>
              <h3>{r.name}</h3>
              <p>{r.address}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BrowseRestaurants;
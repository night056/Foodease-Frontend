import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig';
import Navbar from '../components/Navbar';
import '../styles.css';
import { jwtDecode } from 'jwt-decode';

const MyRatingsPage = () => {
  const [ratings, setRatings] = useState([]);
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const username = decoded.sub;

  useEffect(() => {
    document.title = "My Ratings | FoodEase";

    API.get(`/ratings/user/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRatings(res.data))
      .catch(err => console.error('Error fetching ratings:', err));
  }, [username, token]);

  return (
    <>
      <Navbar role="customer" username={username} />
      <div className="ratings-page">
        <h2 className="form-title">⭐ My Ratings</h2>

        {ratings.length === 0 ? (
          <p>You haven't rated any restaurants yet.</p>
        ) : (
          <ul className="ratings-list">
            {ratings.map(rating => (
              <li key={rating.id} className="rating-card">
                <strong>{rating.restaurantName}</strong> — {rating.score} ⭐
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
};

export default MyRatingsPage;
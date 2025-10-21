import React, { useEffect, useState } from 'react';
import API from '../api/AxiosConfig';
import { jwtDecode } from 'jwt-decode';
import Navbar from '../components/Navbar';
import '../styles.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ username: '', phone: '' });

  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const username = decoded.sub;
  const role = decoded.role?.toLowerCase() || decoded.roles?.[0]?.toLowerCase(); // fallback for multiple roles

  useEffect(() => {
    document.title = "Profile";
    API.get('/user/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(res.data);
        setForm({ username: res.data.username, phone: res.data.phone });
      })
      .catch((err) => console.error('Error fetching user:', err));
  }, [token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    API.put('/user/update', form, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        setUser(res.data);
        setEditMode(false);
        alert('Profile updated successfully!');
      })
      .catch((err) => {
        console.error('Update failed:', err);
        alert('Failed to update profile.');
      });
  };

  if (!user) return <p>Loading profile...</p>;

  return (
    <>
      <Navbar role={role} username={username} />
      <div className="profile-card">
        <h2 className="form-title">👤 User Profile</h2>

        {editMode ? (
          <>
            <label>Username:</label>
            <input name="username" value={form.username} onChange={handleChange} />

            <label>Phone:</label>
            <input name="phone" value={form.phone} onChange={handleChange} />

            <div className="profile-actions">
              <button className="submit-button" onClick={handleUpdate}>Save</button>
              <button className="explore-button" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <p><strong>Roles:</strong> {user.roles.join(', ')}</p>

            <button className="submit-button" onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>
    </>
  );
};

export default UserProfile;
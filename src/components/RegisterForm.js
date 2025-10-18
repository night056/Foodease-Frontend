import React, { useState } from 'react';
import { registerUser } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles.css';

const RegisterForm = () => {
  const [form, setForm] = useState({
    username: '',
    phone: '',
    password: '',
    roles: [],
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setForm((prevForm) => {
      const updatedRoles = checked
        ? [...prevForm.roles, value]
        : prevForm.roles.filter((role) => role !== value);
      return { ...prevForm, roles: updatedRoles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser(form);
      const token = res.data;

      if (!token || typeof token !== 'string') {
        throw new Error('Invalid token received');
      }

      localStorage.setItem('token', token);
      const decoded = jwtDecode(token);

      const username = decoded.sub;
      const roles = decoded.roles || [decoded.role];
      const primaryRole = roles[0].toLowerCase().replace('_', '-');

      navigate(`/dashboard/${primaryRole}/${username}`);
    } catch (err) {
      console.error('Registration error:', err);
      alert('Registration failed');
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Create Your FoodEase Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />
        <input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <div className="role-section">
          <label className="role-label">Select Role(s):</label>
          <div className="role-options">
            {['customer', 'owner', 'admin', 'delivery'].map(role => (
              <label key={role} className="role-option">
                <input
                  type="checkbox"
                  value={role}
                  onChange={handleRoleCheckboxChange}
                />
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </label>
            ))}
          </div>
        </div>
        <br></br>
        <br></br>
        <button type="submit" className="submit-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
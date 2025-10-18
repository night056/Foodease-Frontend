import React, { useState } from 'react';
import { loginUser } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../styles.css';

const availableRoles = ['CUSTOMER', 'OWNER', 'DELIVERY', 'ADMIN'];

const formatRole = (role) => {
  return role
    .replace('_', ' ')
    .toLowerCase()
    .replace(/\b\w/g, c => c.toUpperCase());
};

const LoginForm = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    role: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await loginUser(form);
      const token = res.data;

      localStorage.setItem('token', token);

      const decoded = jwtDecode(token);
      const username = decoded.sub;
      const role = form.role.toLowerCase();

      navigate(`/dashboard/${role}/${username}`);
    } catch (err) {
      console.error('Login error:', err);
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="username"
        placeholder="Username"
        onChange={handleChange}
        required
      />
      <br></br>
      <br></br>
      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <div className="role-section">
        <label className="role-label">Select Role:</label>
        <div className="role-options">
          {availableRoles.map((role) => (
            <label key={role} className="role-option">
              <input
                type="radio"
                name="role"
                value={role}
                checked={form.role === role}
                onChange={handleChange}
                required
              />
              {formatRole(role)}
            </label>
          ))}
        </div>
      </div>
      <br></br>
      <br></br>
      <button type="submit" className="submit-button" disabled={!form.role}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;
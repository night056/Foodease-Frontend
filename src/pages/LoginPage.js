import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {

  useEffect(() => {
    document.title = "Login | FoodEase";
  }, []);

  return (
    <div className="page-container">
      <div className="form-card">
        <h2 className="form-title">Welcome Back to FoodEase</h2>
        <LoginForm />
        <p className="form-footer">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
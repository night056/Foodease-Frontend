import React, { useEffect } from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  useEffect(() => {
      document.title = "Register | FoodEase";
    }, []);
  return (
    <div className="page-container">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
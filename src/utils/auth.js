// utils/auth.js
export const getUserInfoFromToken = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const payload = JSON.parse(atob(token.split('.')[1]));
  return {
    username: payload.sub,
    role: payload.role
  };
};
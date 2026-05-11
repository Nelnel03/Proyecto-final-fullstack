import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ children, roleRequired, rolesAllowed = [] }) => {
  const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';
  const userStr = sessionStorage.getItem('user');
  let user = {};
  
  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (e) {
    console.error("Error parsing user from sessionStorage", e);

  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // Si se define rol requerido único
  if (roleRequired && user.rol !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  // Si se define lista de roles permitidos
  if (rolesAllowed.length > 0 && !rolesAllowed.includes(user.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoutes;
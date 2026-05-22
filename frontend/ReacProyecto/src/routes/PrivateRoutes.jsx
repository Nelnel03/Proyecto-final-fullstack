import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasPermission } from '../utils/permissions';

const rolToDashboard = (rol) => {
  if (rol === 'admin') return '/admin';
  if (rol === 'voluntario') return '/dashboard-voluntario';
  return '/dashboard-user';
};

/**
 * Route Guard for Authentication and Authorization.
 * On role mismatch, redirects to the user's correct dashboard instead of /unauthorized.
 */
const PrivateRoutes = ({
  children,
  roleRequired,
  rolesAllowed = [],
  perform
}) => {
  const isAuth = sessionStorage.getItem('isAuthenticated') === 'true';
  const userStr = sessionStorage.getItem('user');
  let user = {};

  try {
    if (userStr) {
      user = JSON.parse(userStr);
    }
  } catch (e) { console.error(e);
    console.error("Error parsing user from sessionStorage", e);
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (roleRequired && user.rol !== roleRequired) {
    return <Navigate to={rolToDashboard(user.rol)} replace />;
  }

  if (rolesAllowed.length > 0 && !rolesAllowed.includes(user.rol)) {
    return <Navigate to={rolToDashboard(user.rol)} replace />;
  }

  if (perform && !hasPermission(user, perform)) {
    return <Navigate to={rolToDashboard(user.rol)} replace />;
  }

  return children;
};

export default PrivateRoutes;

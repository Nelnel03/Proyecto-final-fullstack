import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasPermission } from '../utils/permissions';

/**
 * Route Guard for Authentication and Authorization.
 */
const PrivateRoutes = ({ 
  children, 
  roleRequired, 
  rolesAllowed = [], 
  perform // Nuevo: Permiso específico requerido
}) => {
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

  // 1. Verificar Autenticación
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  // 2. Verificar Rol Único (Legacy support)
  if (roleRequired && user.rol !== roleRequired) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Verificar Lista de Roles
  if (rolesAllowed.length > 0 && !rolesAllowed.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Verificar Permiso Granular (Nuevo estándar)
  if (perform && !hasPermission(user, perform)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoutes;
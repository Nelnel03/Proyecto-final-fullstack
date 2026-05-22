import React from 'react';
import { hasPermission } from '../utils/permissions';

/**
 * Componente para control de acceso visual granular.
 * Renderiza children solo si el usuario tiene el permiso requerido.
 * 
 * Uso: 
 * <Can perform="manage_users">
 *   <button>Eliminar Usuario</button>
 * </Can>
 */
export const Can = ({ perform, children, fallback = null }) => {
  const userStr = sessionStorage.getItem('user');
  let user = null;
  
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) { console.error(e);
    user = null;
  }

  if (hasPermission(user, perform)) {
    return <>{children}</>;
  }

  return fallback;
};

/**
 * Hook para verificar acceso en la lógica de los componentes.
 */
export const useAccess = () => {
  const userStr = sessionStorage.getItem('user');
  let user = null;
  
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch (e) { console.error(e);
    user = null;
  }

  return {
    can: (permission) => hasPermission(user, permission),
    role: user?.rol || 'visitante',
    user
  };
};

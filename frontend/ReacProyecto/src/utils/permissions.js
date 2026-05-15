/**
 * @file permissions.js
 * @description Definición de roles y mapeo de permisos granulares.
 */

export const ROLES = {
  ADMIN: 'admin',
  VOLUNTARIO: 'voluntario',
  USER: 'user',
  VISITANTE: 'visitante'
};

/**
 * Mapeo de permisos por rol.
 * Esto permite centralizar qué puede hacer cada tipo de usuario.
 */
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    'manage_users',
    'manage_arboles',
    'manage_abonos',
    'view_dashboard_admin',
    'delete_records',
    'edit_any_profile',
    'approve_volunteers'
  ],
  [ROLES.VOLUNTARIO]: [
    'view_dashboard_voluntario',
    'create_reports',
    'view_tasks',
    'edit_own_profile',
    'register_arboles'
  ],
  [ROLES.USER]: [
    'view_dashboard_user',
    'view_map',
    'edit_own_profile',
    'view_own_impact'
  ],
  [ROLES.VISITANTE]: [
    'view_map',
    'view_landing'
  ]
};

/**
 * Función helper para verificar si un usuario tiene un permiso específico.
 * @param {Object} user - Objeto de usuario con propiedad 'rol'.
 * @param {string} permission - El permiso a verificar.
 * @returns {boolean}
 */
export const hasPermission = (user, permission) => {
  if (!user || !user.rol) return false;
  
  // El admin tiene todos los permisos automáticamente
  if (user.rol === ROLES.ADMIN) return true;
  
  const permissions = ROLE_PERMISSIONS[user.rol] || [];
  return permissions.includes(permission);
};

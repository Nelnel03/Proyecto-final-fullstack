/**
 * Constantes y configuraciones centralizadas de la aplicación
 * Evita datos quemados (hardcoded) en los componentes
 */

// ==================== IDIOMA Y FORMATO ====================
export const MONTH_NAMES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
export const MONTH_NAMES_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
export const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const DAY_NAMES_FULL = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// ==================== ESTADOS DE ÁRBOLES ====================
export const TREE_STATES = {
  VIVO: 'vivo',
  MUERTO: 'muerto',
  ENFERMO: 'enfermo',
  EN_RIESGO: 'enfermo'
};

export const TREE_STATE_LABELS = {
  vivo: { label: 'Vivos', color: '#10b981', bgColor: 'rgba(16, 185, 129, 0.1)' },
  muerto: { label: 'Inactivos', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.1)' },
  enfermo: { label: 'En Riesgo', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.1)' }
};

// ==================== ESTADOS DE REPORTES ====================
export const REPORT_STATES_SUPPORT = ['Pendiente', 'En Proceso', 'Leído', 'Solucionado'];
export const REPORT_STATES_THEFT = ['Pendiente', 'En Investigación', 'Resuelto'];

export const STATE_COLORS = {
  // Estados de soporte
  'solucionado': { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--ui-success)' },
  'resuelto': { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--ui-success)' },
  'aprobada': { bg: 'rgba(16, 185, 129, 0.1)', text: 'var(--ui-success)' },
  'enproceso': { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--ui-info)' },
  'eninvestigación': { bg: 'rgba(59, 130, 246, 0.1)', text: 'var(--ui-info)' },
  'rechazada': { bg: 'rgba(239, 68, 68, 0.1)', text: 'var(--ui-error)' },
  'default': { bg: 'rgba(245, 158, 11, 0.1)', text: 'var(--ui-warning)' }
};

// ==================== PAGINACIÓN ====================
export const PAGINATION_ITEMS_PER_PAGE = 6;
export const PAGINATION_ITEMS_PER_PAGE_USERS = 8;

// ==================== CONFIGURACIÓN DE TABS ====================
export const VOLUNTARIADO_SUB_TABS = [
  { value: 'activos', label: 'Activos' },
  { value: 'inactivos', label: 'Inactivos' },
  { value: 'solicitudes', label: 'Solicitudes' }
];

export const SOPORTE_SUB_TABS = [
  { value: 'usuarios', label: 'Comunidad' },
  { value: 'voluntarios', label: 'Equipo Interno' }
];

export const POSTULACION_SUB_TABS = [
  { value: 'pendiente', label: 'Pendientes' },
  { value: 'aprobada', label: 'Aprobadas' },
  { value: 'rechazada', label: 'Rechazadas' }
];

export const LABOR_SUB_TABS = [
  { value: 'nuevas', label: 'Nuevas' },
  { value: 'completadas', label: 'Completadas' },
  { value: 'historial', label: 'Historial' }
];

// ==================== ROLES ====================
export const USER_ROLES = {
  ADMIN: 'admin',
  VOLUNTARIO: 'voluntario',
  USUARIO: 'usuario'
};

export const ROLE_LABELS = {
  admin: 'Administrador',
  voluntario: 'Voluntario',
  usuario: 'Usuario'
};

// ==================== UTILIDADES ====================
/**
 * Obtiene el color para un estado
 * @param {string} estado - El estado a buscar
 * @returns {object} Objeto con bg y text
 */
export const getStateColor = (estado) => {
  if (!estado) return STATE_COLORS.default;
  const normalized = (estado || '').toLowerCase().replace(/\s/g, '');
  return STATE_COLORS[normalized] || STATE_COLORS.default;
};

/**
 * Obtiene el label y color de un estado de árbol
 * @param {string} treeState - El estado del árbol
 * @returns {object} Objeto con label, color, bgColor
 */
export const getTreeStateInfo = (treeState) => {
  return TREE_STATE_LABELS[treeState] || TREE_STATE_LABELS.vivo;
};

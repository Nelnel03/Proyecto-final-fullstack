/**
 * @file config.jsx
 * @description Configuración centralizada para peticiones a la API.
 */

/** URL base incluyendo prefijo /api */
export const BASE_URL = "http://localhost:3005/api";

/**
 * Retorna el header Authorization con el JWT almacenado en sessionStorage.
 * @returns {Object} Objeto de headers con Authorization o vacío si no hay token.
 */
export function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

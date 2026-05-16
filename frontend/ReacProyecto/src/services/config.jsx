/**
 * @file config.jsx
 * @description Configuración centralizada para peticiones a la API.
 */

/** URL base para la API */
export const BASE_URL = "http://localhost:3000/api";

/**
 * Retorna el header Authorization con el JWT almacenado en sessionStorage.
 * @returns {Object} Objeto de headers con Authorization o vacío si no hay token.
 */
export function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

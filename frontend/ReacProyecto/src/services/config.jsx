/**
 * @file config.jsx
 * @description Configuración centralizada para peticiones a la API.
 */

/** URL base incluyendo prefijo /api */
export const BASE_URL = "/api";

/**
 * Retorna el header Authorization con el JWT almacenado en sessionStorage.
 * @returns {Object} Objeto de headers con Authorization o vacío si no hay token.
 */
<<<<<<< HEAD
export const BASE_URL = "http://localhost:3000";
=======
export function getAuthHeaders() {
  const token = sessionStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}
>>>>>>> a4e21153651306ccf166512b2a97767b41bac9b5

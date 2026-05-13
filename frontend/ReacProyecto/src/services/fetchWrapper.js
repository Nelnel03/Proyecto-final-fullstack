/**
 * @file fetchWrapper.js
 * @description Wrapper centralizado sobre fetch() que integra automáticamente
 * el sistema global de loading sin requerir configuración manual en cada componente.
 * También estandariza las respuestas y maneja errores HTTP.
 */
import { BASE_URL } from './config.jsx';
import { parseApiError, NetworkError } from '../utils/errors';

/* ─── Helpers internos ───────────────────────────────────────── */

/**
 * Construye una respuesta estandarizada.
 * @returns {{ status: string, data: any, message: string, error: any }}
 */
function buildResponse(data, message = 'OK') {
  return { status: 'success', data, message, error: null };
}

function buildError(error, message) {
  // Ahora manejamos instancias de ApiError y derivadas
  return { status: 'error', data: null, message: message || error.message, error };
}

/* ─── Wrapper principal ──────────────────────────────────────── */

/**
 * Realiza una petición HTTP estandarizada con manejo de errores.
 *
 * @param {string} endpoint     Ruta relativa (e.g. '/arboles').
 * @param {Object} options      Opciones de fetch.
 * @param {Object} config
 * @param {number} config.timeout   Tiempo máximo en ms antes de abortar (default 15000).
 * @returns {Promise<{ status, data, message, error }>}
 */
export async function apiFetch(endpoint, options = {}, { timeout = 15000 } = {}) {
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), timeout);

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: defaultHeaders,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Parsear body
    let data;
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMsg = data?.message || data?.error;
      throw parseApiError(response.status, data, errorMsg);
    }

    return buildResponse(data);
  } catch (err) {
    clearTimeout(timeoutId);

    // Si ya es un error nuestro, lo relanzamos para que useRequestState/useErrorHandler lo atrape
    if (err.name && err.name.endsWith('Error') && err.name !== 'TypeError') {
      throw err;
    }

    if (err.name === 'AbortError') {
      throw new NetworkError('La solicitud tardó demasiado. Por favor reintenta.');
    }
    
    // Si falla el fetch por CORS o red
    throw new NetworkError();
  }
}

/* ─── Métodos de conveniencia ────────────────────────────────── */
export const apiGet    = (endpoint, cfg)       => apiFetch(endpoint, { method: 'GET' }, cfg);
export const apiPost   = (endpoint, body, cfg) => apiFetch(endpoint, { method: 'POST',   body: JSON.stringify(body) }, cfg);
export const apiPut    = (endpoint, body, cfg) => apiFetch(endpoint, { method: 'PUT',    body: JSON.stringify(body) }, cfg);
export const apiDelete = (endpoint, cfg)       => apiFetch(endpoint, { method: 'DELETE' }, cfg);

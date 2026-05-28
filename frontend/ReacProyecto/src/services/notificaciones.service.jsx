/**
 * @file notificaciones.service.jsx
 * @description Servicio dedicado al sistema de notificaciones leídas/no leídas.
 * Expone endpoints para obtener el resumen y marcar como leídas.
 */

import { BASE_URL, getAuthHeaders } from './config.jsx';

/**
 * Obtiene el resumen de notificaciones no leídas.
 * @returns {Promise<{ total: number, soporte: number, robos: number, solicitudes: number, labores: number }>}
 */
export async function getNotificacionesSummary() {
  try {
    const res = await fetch(`${BASE_URL}/notificaciones/summary`, {
      headers: { ...getAuthHeaders() }
    });
    if (!res.ok) return { total: 0, soporte: 0, robos: 0, solicitudes: 0, labores: 0 };
    return await res.json();
  } catch (error) {
    console.error('Error al obtener resumen de notificaciones:', error);
    return { total: 0, soporte: 0, robos: 0, solicitudes: 0, labores: 0 };
  }
}

/**
 * Marca como leídos los registros indicados por tabla.
 * @param {{ reportes?: number[], robos?: number[], solicitudes?: number[], labores?: number[] }} ids
 * @returns {Promise<{ affected: number, summary: object }>}
 */
export async function markNotificacionesRead(ids = {}) {
  try {
    const res = await fetch(`${BASE_URL}/notificaciones/mark-read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ ids })
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error al marcar notificaciones como leídas:', error);
    return null;
  }
}

/**
 * Marca TODAS las notificaciones como leídas (bulk).
 * @returns {Promise<{ affected: number, summary: object }>}
 */
export async function markAllNotificacionesRead() {
  try {
    const res = await fetch(`${BASE_URL}/notificaciones/mark-all-read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    return null;
  }
}

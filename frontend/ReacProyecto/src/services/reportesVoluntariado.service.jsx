/**
 * @file reportesVoluntariado.service.jsx
 * @description Servicio enfocado en el manejo de reportes generado por voluntarios sobre actividades forestales.
 */

import { BASE_URL } from "./config.jsx";

/**
 * Obtiene la lista completa de reportes realizados por voluntarios.
 * @async
 * @function getReportesVoluntariado
 * @returns {Promise<Array>} Un array con los objetos de reportes de voluntariado, o un array vacío en caso de error.
 */
export async function getReportesVoluntariado() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_voluntariado`);
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al obtener los reportes de voluntariado", error);
    return [];
  }
}

/**
 * Envía un nuevo reporte generado por un voluntario mediante una petición POST.
 * @async
 * @function postReporteVoluntariado
 * @param {Object} reporte Objeto con la información del nuevo reporte a registrar.
 * @returns {Promise<Object>} El objeto del reporte creado o undefined en caso de error.
 */
export async function postReporteVoluntariado(reporte) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_voluntariado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    if (!respuesta.ok) {
        if (respuesta.status === 413) throw new Error("La imagen es demasiado pesada para el servidor.");
        throw new Error("No se pudo enviar el reporte.");
    }
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al enviar el reporte de voluntariado", error);
    throw error;
  }
}
/**
 * Actualiza un reporte de voluntariado existente (usado para marcarlo comovisto o cambiar su estado).
 * @async
 * @function putReporteVoluntariado
 * @param {Object} reporte Objeto con los datos actualizados del reporte.
 * @param {string|number} id Identificador único del reporte a modificar.
 */
export async function putReporteVoluntariado(reporte, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_voluntariado/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    if (!respuesta.ok) throw new Error("No se pudo actualizar el reporte.");
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar el reporte de voluntariado", error);
  }
}

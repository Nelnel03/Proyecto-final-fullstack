/**
 * @file reportes.service.jsx
 * @description Servicio CRUD centralizado para el manejo de los reportes generales de los usuarios.
 */

import { BASE_URL } from "./config.jsx";

/**
 * Obtiene la lista completa de reportes generales generados por usuarios.
 * @async
 * @function getReportes
 * @returns {Promise<Array>} Un array de objetos con la información de los reportes, o un array vacío en caso de error.
 */
export async function getReportes() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes`);
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al obtener reportes", error);
    return [];
  }
}

/**
 * Crea un nuevo reporte general en el sistema mediante una petición POST.
 * @async
 * @function postReportes
 * @param {Object} reporte Objeto con la información requerida del reporte.
 * @returns {Promise<Object>} El objeto del reporte creado o undefined en caso de error.
 */
export async function postReportes(reporte) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear reporte", error);
  }
}

/**
 * Actualiza la información de un reporte existente mediante una petición PUT.
 * @async
 * @function putReportes
 * @param {Object} reporte Objeto con los nuevos datos actualizados del reporte.
 * @param {number|string} id El identificador único del reporte a actualizar.
 * @returns {Promise<Object>} El objeto del reporte actualizado o undefined en caso de error.
 */
export async function putReportes(reporte, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar reporte", error);
  }
}

/**
 * Elimina un reporte del sistema mediante una petición DELETE.
 * @async
 * @function deleteReportes
 * @param {number|string} id El identificador único del reporte a eliminar.
 * @returns {Promise<Object>} El resultado de la operación o undefined en caso de error.
 */
export async function deleteReportes(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el reporte", error);
  }
}

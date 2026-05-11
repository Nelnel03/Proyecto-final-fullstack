/**
 * @file reportesRobados.service.jsx
 * @description Servicio CRUD enfocado en el manejo de denuncias de árboles robados en la plataforma.
 */

import { BASE_URL } from "./config.jsx";

/**
 * Obtiene la lista completa de reportes de árboles robados registrados en el sistema.
 * @async
 * @function getReportesRobados
 * @returns {Promise<Array>} Un array de objetos con las denuncias de robo, o un array vacío en caso de error.
 */
export async function getReportesRobados() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados`);
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al obtener reportes de árboles robados", error);
    return [];
  }
}

/**
 * Registra una nueva denuncia de robo de árbol en el sistema mediante una petición POST.
 * @async
 * @function postReportesRobados
 * @param {Object} reporte Objeto con la información de la denuncia de robo.
 * @returns {Promise<Object>} El objeto del reporte creado o undefined en caso de error.
 */
export async function postReportesRobados(reporte) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear reporte de árbol robado", error);
  }
}

/**
 * Elimina un registro de denuncia de robo mediante una petición DELETE.
 * @async
 * @function deleteReportesRobados
 * @param {number|string} id El identificador único del reporte de robo a eliminar.
 * @returns {Promise<Object>} El resultado de la operación o undefined en caso de error.
 */
export async function deleteReportesRobados(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el reporte de robo", error);
  }
}

/**
 * Actualiza la información de un reporte de robo existente mediante una petición PUT.
 * @async
 * @function putReportesRobados
 * @param {Object} reporte Objeto con los nuevos datos actualizados del reporte de robo.
 * @param {number|string} id El identificador único del reporte a actualizar.
 * @returns {Promise<Object>} El objeto del reporte actualizado o undefined en caso de error.
 */
export async function putReportesRobados(reporte, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes_robados/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(reporte),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar reporte de robo", error);
  }
}

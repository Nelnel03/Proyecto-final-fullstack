/**
 * @file statsTipos.service.jsx
 * @description Servicio CRUD para el manejo de estadísticas por tipos de árboles.
 */

import { BASE_URL } from "./config.jsx";

/**
 * Obtiene la lista completa de estadísticas por tipos de árboles.
 * @async
 * @function getStatsTipos
 * @returns {Promise<Array>} Un array de objetos con las estadísticas generales, o un array vacío en caso de error.
 */
export async function getStatsTipos() {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats_tipos`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener stats de tipos", error);
    return [];
  }
}

/**
 * Crea un nuevo registro de estadística por tipo mediante una petición POST.
 * @async
 * @function postStatsTipos
 * @param {Object} stat Objeto con la información requerida de la estadística a crear.
 * @returns {Promise<Object>} El objeto de la estadística creada o undefined en caso de error.
 */
export async function postStatsTipos(stat) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats_tipos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stat),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear stat de tipo", error);
  }
}

/**
 * Actualiza la información de un registro de estadísticas por tipo existente mediante una petición PUT.
 * @async
 * @function putStatsTipos
 * @param {Object} stat Objeto con los nuevos datos actualizados del registro.
 * @param {number|string} id El identificador único del registro a actualizar.
 * @returns {Promise<Object>} El objeto de la estadística actualizada o undefined en caso de error.
 */
export async function putStatsTipos(stat, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats_tipos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(stat),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar stat de tipo", error);
  }
}

/**
 * Elimina un registro de estadística por tipo mediante una petición DELETE.
 * @async
 * @function deleteStatsTipos
 * @param {number|string} id El identificador único del registro a eliminar.
 * @returns {Promise<Object>} El resultado de la operación o undefined en caso de error.
 */
export async function deleteStatsTipos(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats_tipos/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar stat de tipo", error);
  }
}

/**
 * @file arboles.service.jsx
 * @description Servicio CRUD para el manejo de los árboles plantados o registrados.
 */

import { BASE_URL } from "./config.jsx";

/**
 * Obtiene la lista completa de árboles registrados en el sistema.
 * @async
 * @function getArboles
 * @returns {Promise<Array>} Un array de objetos con la información de los árboles, o un array vacío en caso de error.
 */
export async function getArboles() {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los árboles", error);
    return [];
  }
}

/**
 * Crea un nuevo registro de árbol en el sistema mediante una petición POST.
 * @async
 * @function postArboles
 * @param {Object} arbol Objeto con la información requerida del nuevo árbol.
 * @returns {Promise<Object>} El objeto del árbol creado o undefined en caso de error.
 */
export async function postArboles(arbol) {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arbol),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear el árbol", error);
  }
}

/**
 * Actualiza la información de un árbol existente mediante una petición PUT.
 * @async
 * @function putArboles
 * @param {Object} arbol Objeto con los nuevos datos actualizados del árbol.
 * @param {number|string} id El identificador único del árbol a actualizar.
 * @returns {Promise<Object>} El objeto del árbol actualizado o undefined en caso de error.
 */
export async function putArboles(arbol, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(arbol),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar el árbol", error);
  }
}

/**
 * Elimina un registro de árbol en el sistema mediante una petición DELETE.
 * @async
 * @function deleteArboles
 * @param {number|string} id El identificador único del árbol a eliminar.
 * @returns {Promise<Object>} El resultado de la operación o undefined en caso de error.
 */
export async function deleteArboles(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el árbol", error);
  }
}

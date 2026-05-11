/**
 * @file abonos.service.jsx
 * @description Servicio CRUD para el manejo de los abonos aplicados a los árboles del sistema.
 */

import { BASE_URL } from "./config.jsx";

/**
 * Obtiene la lista completa de abonos registrados en el sistema.
 * @async
 * @function getAbonos
 * @returns {Promise<Array>} Un array de objetos con la información de los abonos, o un array vacío en caso de error.
 */
export async function getAbonos() {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos`);
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener los abonos", error);
    return [];
  }
}

/**
 * Registra un nuevo abono para un árbol mediante una petición POST.
 * @async
 * @function postAbonos
 * @param {Object} abono Objeto con la información requerida del nuevo abono.
 * @returns {Promise<Object>} El objeto del abono creado o undefined en caso de error.
 */
export async function postAbonos(abono) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abono),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear el abono", error);
  }
}

/**
 * Actualiza la información de un registro de abono existente mediante una petición PUT.
 * @async
 * @function putAbonos
 * @param {Object} abono Objeto con los datos actualizados del abono.
 * @param {number|string} id El identificador único del abono a actualizar.
 * @returns {Promise<Object>} El objeto del abono actualizado o undefined en caso de error.
 */
export async function putAbonos(abono, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(abono),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar el abono", error);
  }
}

/**
 * Elimina un registro de abono del sistema mediante una petición DELETE.
 * @async
 * @function deleteAbonos
 * @param {number|string} id El identificador único del abono a eliminar.
 * @returns {Promise<Object>} El resultado de la operación o undefined en caso de error.
 */
export async function deleteAbonos(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar the abono", error);
  }
}

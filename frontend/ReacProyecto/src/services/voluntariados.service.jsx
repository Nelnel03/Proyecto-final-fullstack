/**
 * @file voluntariados.service.jsx
 * @description Servicio CRUD enfocado en el manejo de los usuarios con rol de voluntario.
 */

import { BASE_URL } from "./config.jsx";

/**
 * Obtiene la lista de usuarios cuyo rol es 'voluntario'.
 * @async
 * @function getVoluntariados
 * @returns {Promise<Array>} Un array de objetos con la información de los voluntarios, o un array vacío en caso de error.
 */
export async function getVoluntariados() {
  try {
    const respuestaServidor = await fetch(`${BASE_URL}/usuarios?rol=voluntario`);
    const datosVoluntariados = await respuestaServidor.json();
    return datosVoluntariados;
  } catch (error) {
    console.error("Error al obtener los voluntariados", error);
    return [];
  }
}

/**
 * Registra un nuevo voluntario en el sistema mediante una petición POST al endpoint de usuarios.
 * @async
 * @function postVoluntariados
 * @param {Object} voluntariado Objeto con la información del voluntario a registrar.
 * @returns {Promise<Object>} El objeto del voluntario creado o undefined en caso de error.
 */
export async function postVoluntariados(voluntariado) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voluntariado),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear el voluntariado", error);
  }
}

/**
 * Actualiza la información de un voluntario existente mediante una petición PUT.
 * @async
 * @function putVoluntariados
 * @param {Object} voluntariado Objeto con los nuevos datos actualizados.
 * @param {number|string} id El identificador único del voluntario (usuario) a actualizar.
 * @returns {Promise<Object>} El objeto del voluntario actualizado o undefined en caso de error.
 */
export async function putVoluntariados(voluntariado, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(voluntariado),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar the voluntariado", error);
  }
}

/**
 * Elimina el registro de un voluntario mediante una petición DELETE al endpoint de usuarios.
 * @async
 * @function deleteVoluntariados
 * @param {number|string} id El identificador único del voluntario (usuario) a eliminar.
 * @returns {Promise<Object>} El resultado de la operación o undefined en caso de error.
 */
export async function deleteVoluntariados(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el voluntariado", error);
  }
}

/**
 * @file usuarios.service.jsx
 * @description Servicio CRUD para el manejo de los usuarios de la plataforma.
 */

import { BASE_URL } from "./config.jsx";

/**
 * Obtiene la lista completa de los usuarios registrados en el sistema.
 * @async
 * @function getUsuarios
 * @returns {Promise<Array>} Un array de objetos con la información de los usuarios, o un array vacío en caso de error.
 */
export async function getUsuarios() {
  try {
    const respuestaServidor = await fetch(`${BASE_URL}/usuarios`);
    const datosUsuarios = await respuestaServidor.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al obtener los usuarios", error);
    return [];
  }
}

/**
 * Crea un nuevo usuario en el sistema mediante una petición POST.
 * @async
 * @function postUsuarios
 * @param {Object} usuario Objeto con la información requerida del nuevo usuario a crear.
 * @returns {Promise<Object>} El objeto del usuario creado o undefined en caso de error.
 */
export async function postUsuarios(usuario) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    const datosUsuarios = await respuesta.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al crear el usuario", error);
  }
}

/**
 * Actualiza la información de un usuario existente mediante una petición PUT.
 * @async
 * @function putUsuarios
 * @param {Object} usuario Objeto con los nuevos datos actualizados del usuario.
 * @param {number|string} id El identificador único del usuario a actualizar.
 * @returns {Promise<Object>} El objeto del usuario actualizado o undefined en caso de error.
 */
export async function putUsuarios(usuario, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });
    const datosUsuarios = await respuesta.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al actualizar los cambios", error);
  }
}

/**
 * Elimina un registro de usuario del sistema mediante una petición DELETE.
 * @async
 * @function deleteUsuarios
 * @param {number|string} id El identificador único del usuario a eliminar.
 * @returns {Promise<Object>} El resultado de la operación o undefined en caso de error.
 */
export async function deleteUsuarios(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
    });
    const datosUsuarios = await respuesta.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al eliminar el registro", error);
  }
}

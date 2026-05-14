/**
 * @file usuarios.service.jsx
 * @description Servicio CRUD para el manejo de los usuarios de la plataforma.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

export async function getUsuarios() {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios?size=500`, {
      headers: { ...getAuthHeaders() }
    });
    if (!respuesta.ok) return [];
    const data = await respuesta.json();
    return Array.isArray(data) ? data : (data.items || []);
  } catch (error) {
    console.error("Error al obtener los usuarios", error);
    return [];
  }
}

export async function postUsuarios(usuario) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(usuario),
    });
    const datosUsuarios = await respuesta.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al crear el usuario", error);
  }
}

export async function putUsuarios(usuario, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(usuario),
    });
    const datosUsuarios = await respuesta.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al actualizar los cambios", error);
  }
}

export async function deleteUsuarios(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() }
    });
    const datosUsuarios = await respuesta.json();
    return datosUsuarios;
  } catch (error) {
    console.error("Error al eliminar el registro", error);
  }
}

/**
 * @file voluntariados.service.jsx
 * @description Servicio CRUD enfocado en el manejo de los usuarios con rol de voluntario.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

export async function getVoluntariados() {
  try {
    const respuestaServidor = await fetch(`${BASE_URL}/usuarios?size=500`, {
      headers: { ...getAuthHeaders() }
    });
    if (!respuestaServidor.ok) return [];
    const data = await respuestaServidor.json();
    const items = Array.isArray(data) ? data : (data.items || []);
    return items.filter(u => u.Rol?.nombre === 'voluntario');
  } catch (error) {
    console.error("Error al obtener los voluntariados", error);
    return [];
  }
}

export async function postVoluntariados(voluntariado) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(voluntariado),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear el voluntariado", error);
  }
}

export async function putVoluntariados(voluntariado, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(voluntariado),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar el voluntariado", error);
  }
}

export async function deleteVoluntariados(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/usuarios/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() }
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el voluntariado", error);
  }
}

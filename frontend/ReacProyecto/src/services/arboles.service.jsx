/**
 * @file arboles.service.jsx
 * @description Servicio CRUD para el manejo de los árboles plantados o registrados.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

export async function getArboles() {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles?size=500`);
    if (!respuesta.ok) return [];
    const data = await respuesta.json();
    return Array.isArray(data) ? data : (data.items || []);
  } catch (error) {
    console.error("Error al obtener los árboles", error);
    return [];
  }
}

export async function postArboles(arbol) {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(arbol),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear el árbol", error);
  }
}

export async function putArboles(arbol, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(arbol),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al actualizar el árbol", error);
  }
}

export async function deleteArboles(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/arboles/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() }
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el árbol", error);
  }
}

/**
 * @file reportes.service.jsx
 * @description Servicio CRUD para el manejo de los reportes generales.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

export async function getReportes() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes`, {
      headers: { ...getAuthHeaders() }
    });
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    const todos = Array.isArray(datos) ? datos : [];
    return todos.filter(r => r.tipo !== 'robo');
  } catch (error) {
    console.error("Error al obtener reportes", error);
    return [];
  }
}

export async function postReportes(reporte) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(reporte),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear reporte", error);
  }
}

export async function putReportes(reporte, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(reporte),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar reporte", error);
  }
}

export async function deleteReportes(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() }
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el reporte", error);
  }
}

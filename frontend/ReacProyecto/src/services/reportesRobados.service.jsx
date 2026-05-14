/**
 * @file reportesRobados.service.jsx
 * @description Servicio para el manejo de denuncias de árboles robados.
 * Usa el mismo endpoint /reportes filtrando por tipo='robo'.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

export async function getReportesRobados() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes`, {
      headers: { ...getAuthHeaders() }
    });
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    const todos = Array.isArray(datos) ? datos : [];
    return todos.filter(r => r.tipo === 'robo');
  } catch (error) {
    console.error("Error al obtener reportes de árboles robados", error);
    return [];
  }
}

export async function postReportesRobados(reporte) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ ...reporte, tipo: 'robo' }),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al crear reporte de árbol robado", error);
  }
}

export async function putReportesRobados(reporte, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(reporte),
    });
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar reporte de robo", error);
  }
}

export async function deleteReportesRobados(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() }
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Error al eliminar el reporte de robo", error);
  }
}

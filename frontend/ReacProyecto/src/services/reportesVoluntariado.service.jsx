/**
 * @file reportesVoluntariado.service.jsx
 * @description Servicio para el manejo de reportes de actividades de voluntarios.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

export async function getReportesVoluntariado() {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes-voluntariado`, {
      headers: { ...getAuthHeaders() }
    });
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : (datos.items || []);
  } catch (error) { console.error(error);
    console.error("Error al obtener los reportes de voluntariado", error);
    return [];
  }
}

export async function postReporteVoluntariado(reporte) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes-voluntariado`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(reporte),
    });
    if (!respuesta.ok) {
      if (respuesta.status === 413) throw new Error("La imagen es demasiado pesada para el servidor.");
      const err = await respuesta.json();
      throw new Error(err.message || "No se pudo enviar el reporte.");
    }
    const datos = await respuesta.json();
    return datos;
  } catch (error) { console.error(error);
    console.error("Error al enviar el reporte de voluntariado", error);
    throw error;
  }
}

export async function putReporteVoluntariado(reporte, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/reportes-voluntariado/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(reporte),
    });
    if (!respuesta.ok) throw new Error("No se pudo actualizar el reporte.");
    const datos = await respuesta.json();
    return datos;
  } catch (error) { console.error(error);
    console.error("Error al actualizar el reporte de voluntariado", error);
  }
}

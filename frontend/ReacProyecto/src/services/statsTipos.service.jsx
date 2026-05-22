/**
 * @file statsTipos.service.jsx
 * @description Servicio CRUD para estadísticas. Mapea al endpoint /stats del backend.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

export async function getStatsTipos() {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats`, {
      headers: { ...getAuthHeaders() }
    });
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) { console.error(error);
    console.error("Error al obtener stats de tipos", error);
    return [];
  }
}

export async function postStatsTipos(stat) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(stat),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) { console.error(error);
    console.error("Error al crear stat de tipo", error);
  }
}

export async function putStatsTipos(stat, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(stat),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) { console.error(error);
    console.error("Error al actualizar stat de tipo", error);
  }
}

export async function deleteStatsTipos(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/stats/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() }
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) { console.error(error);
    console.error("Error al eliminar stat de tipo", error);
  }
}

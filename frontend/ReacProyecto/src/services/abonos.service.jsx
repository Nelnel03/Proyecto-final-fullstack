/**
 * @file abonos.service.jsx
 * @description Servicio CRUD para el manejo de los abonos aplicados a los árboles.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

export async function getAbonos() {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos`);
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) { console.error(error);
    console.error("Error al obtener los abonos", error);
    return [];
  }
}

export async function postAbonos(abono) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(abono),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) { console.error(error);
    console.error("Error al crear el abono", error);
  }
}

export async function putAbonos(abono, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(abono),
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) { console.error(error);
    console.error("Error al actualizar el abono", error);
  }
}

export async function deleteAbonos(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/abonos/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() }
    });
    const datos = await respuesta.json();
    return datos;
  } catch (error) { console.error(error);
    console.error("Error al eliminar el abono", error);
  }
}

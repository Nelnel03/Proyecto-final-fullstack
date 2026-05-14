/**
 * @file tareasDisponibles.service.jsx
 * @description Maneja las tareas predeterminadas que el administrador crea para los voluntarios.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

export async function getTareasDisponibles() {
  try {
    const respuesta = await fetch(`${BASE_URL}/tareas`);
    if (!respuesta.ok) return [];
    const datos = await respuesta.json();
    return Array.isArray(datos) ? datos : [];
  } catch (error) {
    console.error("Error al obtener las tareas disponibles", error);
    return [];
  }
}

export async function postTareaDisponible(tarea) {
  try {
    const respuesta = await fetch(`${BASE_URL}/tareas`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(tarea),
    });
    if (!respuesta.ok) {
      const err = await respuesta.json();
      throw new Error(err.message || "No se pudo crear la tarea.");
    }
    return await respuesta.json();
  } catch (error) {
    console.error("Error al enviar la tarea disponible", error);
    throw error;
  }
}

export async function putTareaDisponible(tarea, id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/tareas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(tarea),
    });
    if (!respuesta.ok) throw new Error("No se pudo actualizar la tarea.");
    return await respuesta.json();
  } catch (error) {
    console.error("Error al actualizar la tarea disponible", error);
    throw error;
  }
}

export async function deleteTareaDisponible(id) {
  try {
    const respuesta = await fetch(`${BASE_URL}/tareas/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() }
    });
    if (!respuesta.ok) throw new Error("No se pudo eliminar la tarea.");
    return true;
  } catch (error) {
    console.error("Error al eliminar la tarea disponible", error);
    throw error;
  }
}

import { BASE_URL } from "./config.jsx";

export const getSolicitudesVoluntariado = async () => {
  try {
    const response = await fetch(`${BASE_URL}/solicitudesVoluntariado`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener solicitudes", error);
    return [];
  }
};

export const postSolicitudVoluntariado = async (solicitud) => {
  try {
    const response = await fetch(`${BASE_URL}/solicitudesVoluntariado`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(solicitud),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al crear solicitud", error);
    throw error;
  }
};

export const putSolicitudVoluntariado = async (solicitud, id) => {
  try {
    const response = await fetch(`${BASE_URL}/solicitudesVoluntariado/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(solicitud),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar solicitud", error);
    throw error;
  }
};

export const deleteSolicitudVoluntariado = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/solicitudesVoluntariado/${id}`, {
      method: "DELETE",
    });
    return await response.json();
  } catch (error) {
    console.error("Error al eliminar solicitud", error);
    throw error;
  }
};

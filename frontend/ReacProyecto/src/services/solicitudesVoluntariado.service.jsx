import { BASE_URL, getAuthHeaders } from "./config.jsx";

export const getSolicitudesVoluntariado = async () => {
  try {
    const response = await fetch(`${BASE_URL}/solicitudes`, {
      headers: { ...getAuthHeaders() }
    });
    if (!response.ok) return [];
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) { console.error(error);
    console.error("Error al obtener solicitudes", error);
    return [];
  }
};

export const postSolicitudVoluntariado = async (solicitud) => {
  try {
    const response = await fetch(`${BASE_URL}/solicitudes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(solicitud),
    });
    return await response.json();
  } catch (error) { console.error(error);
    console.error("Error al crear solicitud", error);
    throw error;
  }
};

export const aprobarSolicitudVoluntariado = async (id) => {
  const response = await fetch(`${BASE_URL}/solicitudes/${id}/aprobar`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Error al aprobar la solicitud");
  }
  return data;
};

export const putSolicitudVoluntariado = async (solicitud, id) => {
  try {
    const response = await fetch(`${BASE_URL}/solicitudes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(solicitud),
    });
    return await response.json();
  } catch (error) { console.error(error);
    console.error("Error al actualizar solicitud", error);
    throw error;
  }
};

export const deleteSolicitudVoluntariado = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/solicitudes/${id}`, {
      method: "DELETE",
      headers: { ...getAuthHeaders() }
    });
    return await response.json();
  } catch (error) { console.error(error);
    console.error("Error al eliminar solicitud", error);
    throw error;
  }
};

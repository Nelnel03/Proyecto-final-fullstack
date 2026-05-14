/**
 * @file arboles.service.jsx
 * @description Servicio CRUD para el manejo de los árboles utilizando Axios.
 */
import apiClient from "./apiClient";

export async function getArboles() {
  try {
    const { data } = await apiClient.get('/arboles?size=500');
    return Array.isArray(data) ? data : (data.items || []);
  } catch (error) {
    // El interceptor ya loguea el error, retornamos vacío para evitar fallos en la UI
    return [];
  }
}

export async function postArboles(arbol) {
  const { data } = await apiClient.post('/arboles', arbol);
  return data;
}

export async function putArboles(arbol, id) {
  const { data } = await apiClient.put(`/arboles/${id}`, arbol);
  return data;
}

export async function deleteArboles(id) {
  const { data } = await apiClient.delete(`/arboles/${id}`);
  return data;
}


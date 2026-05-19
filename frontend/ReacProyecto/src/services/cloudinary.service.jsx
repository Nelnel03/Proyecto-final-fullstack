/**
 * @file cloudinary.service.jsx
 * @description Servicio para subir imágenes a Cloudinary a través del backend.
 * Las credenciales de Cloudinary se manejan de forma segura en el servidor.
 */

import { BASE_URL, getAuthHeaders } from "./config.jsx";

/**
 * Sube una imagen a Cloudinary usando el endpoint del backend.
 * @param {File} file El archivo de imagen a subir.
 * @returns {Promise<string>} La URL segura (HTTPS) de la imagen en Cloudinary.
 */
export async function uploadImage(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    // credentials: 'include' asegura que cookies de sesión se acompañen
    // en entornos con sesión basada en cookies o CORS estricto
    credentials: "include",
    body: formData,
  });

  if (!response.ok) {
    let serverMessage;
    try {
      const errorData = await response.json();
      serverMessage = errorData.message;
    } catch {
      serverMessage = null;
    }
    throw new Error(
      serverMessage || `Error ${response.status}: no se pudo subir la imagen`
    );
  }

  const data = await response.json();
  return data.secure_url || data.url;
}

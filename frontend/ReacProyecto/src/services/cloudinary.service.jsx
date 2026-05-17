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
      // No incluir Content-Type — el browser lo pone automáticamente con el boundary correcto para FormData
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Error al subir la imagen");
  }

  const data = await response.json();
  return data.secure_url || data.url;
}

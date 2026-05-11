/**
 * @file cloudinary.service.jsx
 * @description Servicio para gestionar la subida de imágenes a Cloudinary.
 */

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "ml_default"; // Valor por defecto si no existe

/**
 * Sube una imagen a Cloudinary.
 * @param {File} file El archivo de imagen a subir.
 * @returns {Promise<string>} La URL de la imagen subida o un error.
 */
export async function uploadImage(file) {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("cloud_name", CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error de Cloudinary:", errorData);
      throw new Error(errorData.error?.message || "Error al subir la imagen a Cloudinary");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error en uploadImage:", error);
    throw error;
  }
}

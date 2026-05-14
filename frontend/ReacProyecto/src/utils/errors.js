/**
 * @file errors.js
 * @description Clases personalizadas de error y funciones para parsear errores del API.
 * Provee un sistema estandarizado para manejar y categorizar errores en toda la app.
 */

export class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

export class ApiError extends AppError {
  constructor(message, status, data) {
    super(message, status);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export class ValidationError extends AppError {
  constructor(errors) {
    super('Verifica los datos ingresados.', 422);
    this.name = 'ValidationError';
    this.errors = errors; // Format: { field: ['error1', 'error2'] } o array de strings
  }
}

export class NetworkError extends AppError {
  constructor(message = 'No se pudo conectar con el servidor. Verifica tu conexión.') {
    super(message, 0);
    this.name = 'NetworkError';
  }
}

export class AuthError extends AppError {
  constructor(message = 'Tu sesión expiró o no estás autorizado. Inicia sesión nuevamente.') {
    super(message, 401);
    this.name = 'AuthError';
  }
}

/**
 * Parsea un error HTTP y retorna la clase de error personalizada adecuada.
 * Mapea códigos de estado técnicos a mensajes amigables para el usuario.
 */
export const parseApiError = (status, responseData, fallbackMsg) => {
  if (!status) return new NetworkError();

  if (status === 401) return new AuthError();
  if (status === 403) return new ApiError('No tienes permiso para realizar esta acción.', status, responseData);
  if (status === 404) return new ApiError('El recurso solicitado no fue encontrado.', status, responseData);
  if (status === 409) return new ApiError('Conflicto con los datos actuales. Intenta recargar.', status, responseData);
  if (status === 422) {
    // Extrae los errores de validación si existen en responseData.error o responseData.data
    const validationErrors = responseData?.error || responseData?.data || fallbackMsg;
    return new ValidationError(validationErrors);
  }
  if (status === 429) return new ApiError('Demasiadas peticiones. Por favor, intenta más tarde.', status, responseData);
  if (status >= 500) return new ApiError('Ocurrió un problema interno en el servidor. Intenta más tarde.', status, responseData);

  // Fallback genérico
  return new ApiError(fallbackMsg || responseData?.message || 'Ocurrió un error inesperado.', status, responseData);
};

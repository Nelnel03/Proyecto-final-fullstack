/**
 * @file responseHelper.js
 * @description Utilidades para estandarizar todas las respuestas del backend.
 * Garantiza que cada respuesta tenga la estructura: { status, message, data, error }.
 */

/**
 * Envía una respuesta exitosa estandarizada.
 * @param {Object} res        Express response object.
 * @param {any}    data       Datos a retornar.
 * @param {string} message    Mensaje descriptivo.
 * @param {number} statusCode Código HTTP (default 200).
 */
const sendSuccess = (res, data = null, message = 'Operación exitosa', statusCode = 200) => {
    res.status(statusCode).json({
        status: 'success',
        message,
        data,
        error: null,
    });
};

/**
 * Envía una respuesta de error estandarizada.
 * @param {Object} res        Express response object.
 * @param {string} message    Mensaje de error descriptivo.
 * @param {number} statusCode Código HTTP (default 500).
 * @param {any}    error      Detalle técnico del error (solo en desarrollo).
 */
const sendError = (res, message = 'Error interno del servidor', statusCode = 500, error = null) => {
    const payload = {
        status: 'error',
        message,
        data: null,
        error: process.env.NODE_ENV === 'production' ? null : error,
    };
    res.status(statusCode).json(payload);
};

/**
 * Envía una respuesta 404 estandarizada.
 * @param {Object} res     Express response object.
 * @param {string} message Mensaje descriptivo.
 */
const sendNotFound = (res, message = 'Recurso no encontrado') => {
    sendError(res, message, 404);
};

/**
 * Envía una respuesta de validación fallida (422).
 * @param {Object}   res    Express response object.
 * @param {string[]} errors Array de mensajes de error de validación.
 */
const sendValidationError = (res, errors = []) => {
    res.status(422).json({
        status: 'error',
        message: 'Error de validación',
        data: null,
        error: errors,
    });
};

module.exports = { sendSuccess, sendError, sendNotFound, sendValidationError };

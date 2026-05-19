const rateLimit = require('express-rate-limit');

/**
 * Limitador de intentos para rutas críticas (Login/Registro)
 * Enfoque Senior: Prevención de fuerza bruta
 */
const authLimiter = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutos
        max: 5, // Máximo 5 intentos por ventana
        message: {
            status: 'fail',
            message: 'Demasiados intentos desde esta IP, por favor intente de nuevo después de 15 minutos'
        },
        standardHeaders: true, // Retorna info de límite en las cabeceras `RateLimit-*`
        legacyHeaders: false, // Desactiva las cabeceras `X-RateLimit-*`
    });

/**
 * Limitador general para la API
 * Enfoque Senior: Prevención de DoS básico
 */
const apiLimiter = process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 60 * 60 * 1000, // 1 hora
        max: 1000, // 1000 peticiones por hora por IP
        message: {
            status: 'fail',
            message: 'Límite de peticiones excedido para esta IP'
        },
        standardHeaders: true,
        legacyHeaders: false,
    });

module.exports = {
    authLimiter,
    apiLimiter
};

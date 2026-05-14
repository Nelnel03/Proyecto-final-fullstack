/**
 * @file errorMiddleware.js
 * @description Middlewares de Manejo de Errores Centralizado.
 * Todas las respuestas siguen la estructura estandarizada:
 * { status, message, data, error }
 */
const errorMiddleware = {
    // 1. Manejador para rutas no encontradas (404)
    notFound: (req, res, next) => {
        const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
        res.status(404);
        next(error);
    },

    // 2. Manejador global de excepciones (500, etc)
    errorHandler: (err, req, res, next) => {
        console.error("=== Error Capturado por Middleware Global ===", err);
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

        res.status(statusCode).json({
            status: 'error',
            message: err.message || 'Error interno del servidor',
            data: null,
            // Solo mostramos detalles técnicos fuera de producción
            error: process.env.NODE_ENV === 'production'
                ? null
                : { stack: err.stack, code: err.code || 'INTERNAL_SERVER_ERROR' },
        });
    },
};

module.exports = errorMiddleware;

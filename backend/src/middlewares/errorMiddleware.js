/**
 * Middlewares de Manejo de Errores Centralizado
 * Enfoque Senior: Estabilidad y consistencia en las respuestas.
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
        // Si el status code sigue siendo 200 pero hay un error, lo cambiamos a 500
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        
        res.status(statusCode).json({
            message: err.message,
            // Solo mostramos el stack trace si no estamos en producción por seguridad
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
            error_code: err.code || 'INTERNAL_SERVER_ERROR'
        });
    }
};

module.exports = errorMiddleware;

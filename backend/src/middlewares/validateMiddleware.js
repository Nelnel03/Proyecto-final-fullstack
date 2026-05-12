const { validationResult } = require('express-validator');

/**
 * Middleware centralizado para procesar los resultados de las validaciones de express-validator
 */
const validateResults = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'error',
            message: 'Error de validación en los datos recibidos',
            errors: errors.array().map(err => ({
                campo: err.path,
                mensaje: err.msg
            }))
        });
    }
    next();
};

module.exports = validateResults;

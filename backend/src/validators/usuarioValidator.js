const { body } = require('express-validator');

/**
 * Reglas de validación para Usuarios
 */
const usuarioValidator = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
        .escape(),

    body('email')
        .trim()
        .notEmpty().withMessage('El correo es obligatorio')
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),

    body('password')
        .if(body('password').exists()) // Solo si se envía (ej: registro o cambio)
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula'),

    body('rol_id')
        .isInt().withMessage('El ID de rol debe ser un número válido'),

    body('telefono')
        .optional()
        .matches(/^\+?[0-9]{8,15}$/).withMessage('Formato de teléfono no válido'),

    body('status')
        .optional()
        .isIn(['activo', 'baneado', 'inactivo']).withMessage('Status no válido')
];

module.exports = usuarioValidator;

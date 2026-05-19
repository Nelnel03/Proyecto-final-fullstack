const { body } = require('express-validator');

const usuarioUpdateValidator = [
    body('nombre')
        .optional({ checkFalsy: true })
        .trim()
        .isLength({ min: 3, max: 100 }).withMessage('El nombre debe tener entre 3 y 100 caracteres')
        .escape(),

    body('email')
        .optional({ checkFalsy: true })
        .trim()
        .isEmail().withMessage('Debe ser un correo electrónico válido')
        .normalizeEmail(),

    body('password')
        .if(body('password').exists({ checkFalsy: true }))
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    body('rol_id')
        .optional({ checkFalsy: true })
        .isInt().withMessage('El ID de rol debe ser un número válido'),

    body('telefono')
        .optional({ checkFalsy: true, nullable: true })
        .isLength({ min: 4, max: 20 }).withMessage('El teléfono debe tener entre 4 y 20 caracteres'),

    body('status')
        .optional({ checkFalsy: true })
        .isIn(['activo', 'baneado', 'inactivo']).withMessage('Status no válido'),

    body('motivoBan')
        .optional({ checkFalsy: true })
        .trim()
];

module.exports = usuarioUpdateValidator;

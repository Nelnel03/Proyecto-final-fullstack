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
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres')
        .matches(/\d/).withMessage('La contraseña debe contener al menos un número')
        .matches(/[A-Z]/).withMessage('La contraseña debe contener al menos una mayúscula'),

    body('rol_id')
        .optional({ checkFalsy: true })
        .isInt().withMessage('El ID de rol debe ser un número válido'),

    body('telefono')
        .optional({ checkFalsy: true })
        .matches(/^\+?[0-9]{8,15}$/).withMessage('Formato de teléfono no válido'),

    body('status')
        .optional({ checkFalsy: true })
        .isIn(['activo', 'baneado', 'inactivo']).withMessage('Status no válido'),

    body('motivoBan')
        .optional({ checkFalsy: true })
        .trim()
];

module.exports = usuarioUpdateValidator;

const { body } = require('express-validator');

/**
 * Reglas de validación para Árboles
 */
const arbolValidator = [
    body('nombre')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres')
        .escape(),
    
    body('nombreCientifico')
        .optional({ nullable: true })
        .trim()
        .isLength({ max: 150 }).withMessage('El nombre científico es demasiado largo')
        .escape(),

    body('tipo')
        .trim()
        .notEmpty().withMessage('El tipo de árbol es obligatorio'),

    body('progreso')
        .optional({ nullable: true })
        .isInt({ min: 0, max: 100 }).withMessage('El progreso debe estar entre 0 y 100'),

    body('altura_min_m')
        .optional({ nullable: true })
        .isFloat({ min: 0 }).withMessage('La altura mínima debe ser un número positivo'),

    body('altura_max_m')
        .optional({ nullable: true })
        .isFloat({ min: 0 }).withMessage('La altura máxima debe ser un número positivo')
        .custom((value, { req }) => {
            if (value && req.body.altura_min_m && parseFloat(value) < parseFloat(req.body.altura_min_m)) {
                throw new Error('La altura máxima no puede ser menor a la mínima');
            }
            return true;
        }),

    body('estado')
        .optional({ nullable: true })
        .isIn(['vivo', 'muerto', 'enfermo']).withMessage('Estado no válido')
];

module.exports = arbolValidator;

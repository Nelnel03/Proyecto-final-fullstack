const { body } = require('express-validator');

const reporteValidator = [
    body('asunto').trim().notEmpty().withMessage('El asunto es obligatorio').escape(),
    body('contenido').trim().notEmpty().withMessage('El contenido es obligatorio').escape(),
    body('tipo').optional().trim().escape()
];

const abonoValidator = [
    body('arbol_id').isInt().withMessage('ID de árbol inválido'),
    body('voluntario_id').isInt().withMessage('ID de voluntario inválido'),
    body('tipo_abono').trim().notEmpty().withMessage('Tipo de abono es obligatorio').escape(),
    body('cantidad_kg').isFloat({ min: 0.1 }).withMessage('La cantidad debe ser mayor a 0.1 kg')
];

const tareaValidator = [
    body('titulo').trim().notEmpty().withMessage('El título es obligatorio').escape(),
    body('horas').isFloat({ min: 0.1 }).withMessage('Las horas deben ser positivas')
];

module.exports = { reporteValidator, abonoValidator, tareaValidator };

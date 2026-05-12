const express = require('express');
const router = express.Router();
const arbolCrud = require('../cruds/arbolCrud');
const { body, validationResult } = require('express-validator');

/**
 * Middleware para manejar errores de validación
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// --- Definición de Rutas ---

// GET: Todos los árboles
router.get('/', arbolCrud.getAll);

// GET: Detalle de un árbol
router.get('/:id', arbolCrud.getById);

// POST: Registrar un nuevo árbol
router.post('/', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('progreso').optional().isInt({ min: 0, max: 100 }).withMessage('El progreso debe estar entre 0 y 100'),
    body('altura_min_m').optional().isFloat().withMessage('La altura mínima debe ser un número'),
    body('altura_max_m').optional().isFloat().withMessage('La altura máxima debe ser un número'),
    validate
], arbolCrud.create);

// PUT: Actualizar un árbol
router.put('/:id', [
    body('progreso').optional().isInt({ min: 0, max: 100 }).withMessage('El progreso debe estar entre 0 y 100'),
    validate
], arbolCrud.update);

// DELETE: Eliminar un árbol
router.delete('/:id', arbolController.delete);

module.exports = router;

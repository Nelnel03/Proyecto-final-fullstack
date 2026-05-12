const express = require('express');
const router = express.Router();
const tareaCrud = require('../cruds/tareaCrud');
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

// --- Rutas ---

// GET: Listar tareas (soporta query param ?soloActivas=true)
router.get('/', tareaCrud.getAll);

// GET: Una tarea
router.get('/:id', tareaCrud.getById);

// POST: Crear tarea
router.post('/', [
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('horas').optional().isFloat({ min: 0.5 }).withMessage('La duración debe ser al menos 0.5 horas'),
    validate
], tareaCrud.create);

// PUT: Editar tarea
router.put('/:id', [
    body('titulo').optional().notEmpty().withMessage('El título no puede estar vacío'),
    validate
], tareaCrud.update);

// DELETE: Borrar tarea
router.delete('/:id', tareaController.delete);

module.exports = router;

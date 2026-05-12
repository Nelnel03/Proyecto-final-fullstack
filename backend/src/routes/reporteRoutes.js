const express = require('express');
const router = express.Router();
const reporteCrud = require('../cruds/reporteCrud');
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

// GET: Todos los reportes
router.get('/', reporteCrud.getAll);

// GET: Un reporte por ID
router.get('/:id', reporteCrud.getById);

// POST: Crear nuevo reporte
router.post('/', [
    body('usuario_id').isInt().withMessage('ID de usuario no válido'),
    body('rol_id').isInt().withMessage('ID de rol no válido'),
    body('asunto').notEmpty().withMessage('El asunto es obligatorio'),
    body('contenido').notEmpty().withMessage('El contenido es obligatorio'),
    validate
], reporteCrud.create);

// PUT: Actualizar reporte (ej: marcar como visto)
router.put('/:id', [
    body('visto').optional().isInt({ min: 0, max: 1 }).withMessage('El estado visto debe ser 0 o 1'),
    validate
], reporteCrud.update);

// DELETE: Eliminar reporte
router.delete('/:id', reporteController.delete);

module.exports = router;

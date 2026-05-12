const express = require('express');
const router = express.Router();
const reporteVoluntariadoCrud = require('../cruds/reporteVoluntariadoCrud');
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

// GET: Todos los reportes de actividad
router.get('/', reporteVoluntariadoCrud.getAll);

// GET: Un reporte por ID
router.get('/:id', reporteVoluntariadoCrud.getById);

// POST: Enviar nuevo reporte de actividad
router.post('/', [
    body('voluntario_id').isInt().withMessage('ID de voluntario no válido'),
    body('tarea_id').isInt().withMessage('ID de tarea no válido'),
    body('horas').isFloat({ min: 0.1 }).withMessage('Las horas deben ser un número positivo'),
    body('fecha').notEmpty().withMessage('La fecha es obligatoria'),
    validate
], reporteVoluntariadoCrud.create);

// PUT: Actualizar estado o datos del reporte
router.put('/:id', [
    body('estado').optional().isIn(['pendiente', 'aprobado', 'rechazado']).withMessage('Estado no válido'),
    validate
], reporteVoluntariadoCrud.update);

// DELETE: Eliminar reporte
router.delete('/:id', reporteVoluntariadoController.delete);

module.exports = router;

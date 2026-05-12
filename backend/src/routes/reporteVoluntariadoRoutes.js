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

const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// --- Rutas ---

// Todas las rutas de reportes de actividad requieren login
router.use(verifyToken);

// GET: Todos los reportes (Solo Admin)
router.get('/', checkRole(['admin']), reporteVoluntariadoCrud.getAll);

// GET: Un reporte por ID (Solo Admin)
router.get('/:id', checkRole(['admin']), reporteVoluntariadoCrud.getById);

// POST: Enviar nuevo reporte de actividad (Admin y Voluntario)
router.post('/', [
    checkRole(['admin', 'voluntario']),
    body('voluntario_id').isInt().withMessage('ID de voluntario no válido'),
    body('tarea_id').isInt().withMessage('ID de tarea no válido'),
    body('horas').isFloat({ min: 0.1 }).withMessage('Las horas deben ser un número positivo'),
    body('fecha').notEmpty().withMessage('La fecha es obligatoria'),
    validate
], reporteVoluntariadoCrud.create);

// PUT: Actualizar estado (Solo Admin)
router.put('/:id', [
    checkRole(['admin']),
    body('estado').optional().isIn(['pendiente', 'aprobado', 'rechazado']).withMessage('Estado no válido'),
    validate
], reporteVoluntariadoCrud.update);

// DELETE: Solo Admin
router.delete('/:id', checkRole(['admin']), reporteVoluntariadoCrud.delete);

module.exports = router;

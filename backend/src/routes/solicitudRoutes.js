const express = require('express');
const router = express.Router();
const solicitudCrud = require('../cruds/solicitudCrud');
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

// GET: Todas las solicitudes
router.get('/', solicitudCrud.getAll);

// GET: Una solicitud por ID
router.get('/:id', solicitudCrud.getById);

// POST: Crear nueva solicitud
router.post('/', [
    body('usuario_id').isInt().withMessage('ID de usuario no válido'),
    body('mensaje').notEmpty().withMessage('El mensaje es obligatorio'),
    validate
], solicitudCrud.create);

// PUT: Actualizar estado de la solicitud
router.put('/:id', [
    body('estado').isIn(['pendiente', 'aprobada', 'rechazada']).withMessage('Estado no válido'),
    validate
], solicitudCrud.update);

// DELETE: Eliminar solicitud
router.delete('/:id', solicitudCrud.delete);

module.exports = router;

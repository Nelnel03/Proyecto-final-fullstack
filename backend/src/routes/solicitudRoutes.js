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

const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// --- Rutas ---

// Todas las rutas requieren login
router.use(verifyToken);

// GET: Todas las solicitudes (Solo Admin)
router.get('/', checkRole(['admin']), solicitudCrud.getAll);

// GET: Una solicitud por ID (Solo Admin)
router.get('/:id', checkRole(['admin']), solicitudCrud.getById);

// POST: Crear nueva solicitud (Admin, Voluntario, Usuario)
router.post('/', [
    checkRole(['admin', 'voluntario', 'usuario']),
    body('usuario_id').isInt().withMessage('ID de usuario no válido'),
    body('mensaje').notEmpty().withMessage('El mensaje es obligatorio'),
    validate
], solicitudCrud.create);

// PUT: Actualizar estado (Solo Admin)
router.put('/:id', [
    checkRole(['admin']),
    body('estado').isIn(['pendiente', 'aprobada', 'rechazada']).withMessage('Estado no válido'),
    validate
], solicitudCrud.update);

// DELETE: Eliminar solicitud (Solo Admin)
router.delete('/:id', checkRole(['admin']), solicitudCrud.delete);

module.exports = router;

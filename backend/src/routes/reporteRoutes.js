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

const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// --- Rutas ---

// Todas las rutas de reportes requieren estar logueado
router.use(verifyToken);

// GET: Todos los reportes (Solo Admin)
router.get('/', checkRole(['admin']), reporteCrud.getAll);

// GET: Un reporte por ID (Solo Admin)
router.get('/:id', checkRole(['admin']), reporteCrud.getById);

// POST: Crear nuevo reporte (Admin, Voluntario, Usuario)
router.post('/', [
    checkRole(['admin', 'voluntario', 'usuario']),
    body('usuario_id').isInt().withMessage('ID de usuario no válido'),
    body('rol_id').isInt().withMessage('ID de rol no válido'),
    body('asunto').notEmpty().withMessage('El asunto es obligatorio'),
    body('contenido').notEmpty().withMessage('El contenido es obligatorio'),
    validate
], reporteCrud.create);

// PUT/DELETE: Solo Admin
router.put('/:id', checkRole(['admin']), [
    body('visto').optional().isInt({ min: 0, max: 1 }).withMessage('El estado visto debe ser 0 o 1'),
    validate
], reporteCrud.update);

router.delete('/:id', checkRole(['admin']), reporteCrud.delete);

module.exports = router;

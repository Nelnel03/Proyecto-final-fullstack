const express = require('express');
const router = express.Router();
const statsCrud = require('../cruds/statsCrud');
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

// --- Rutas (Protegidas por Admin) ---
router.use(verifyToken, checkRole(['admin']));

// GET: Todas las estadísticas
router.get('/', statsCrud.getAll);

// GET: Una estadística por ID
router.get('/:id', statsCrud.getById);

// POST: Crear registro de estadística
router.post('/', [
    body('tarea_id').isInt().withMessage('ID de tarea no válido'),
    body('periodo').isDate().withMessage('El periodo debe ser una fecha válida (YYYY-MM-DD)'),
    body('total_reportes').optional().isInt({ min: 0 }),
    body('total_horas').optional().isFloat({ min: 0 }),
    validate
], statsCrud.create);

// PUT: Actualizar estadística
router.put('/:id', [
    body('periodo').optional().isDate().withMessage('El periodo debe ser una fecha válida'),
    validate
], statsCrud.update);

// DELETE: Eliminar estadística
router.delete('/:id', statsController.delete);

module.exports = router;

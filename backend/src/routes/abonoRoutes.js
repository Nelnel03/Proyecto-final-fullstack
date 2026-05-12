const express = require('express');
const router = express.Router();
const abonoCrud = require('../cruds/abonoCrud');
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

// GET: Todos los abonos (Público)
router.get('/', abonoCrud.getAll);

// GET: Un registro específico (Público)
router.get('/:id', abonoCrud.getById);

// Rutas protegidas
router.use(verifyToken);

// POST: Registrar nuevo abono (Admin y Voluntario)
router.post('/', [
    checkRole(['admin', 'voluntario']),
    body('arbol_id').isInt().withMessage('ID de árbol no válido'),
    body('voluntario_id').isInt().withMessage('ID de voluntario no válido'),
    body('cantidad_kg').isFloat({ min: 0.1 }).withMessage('La cantidad debe ser un número mayor a 0.1 kg'),
    validate
], abonoCrud.create);

// PUT: Actualizar registro (Admin y Voluntario)
router.put('/:id', [
    checkRole(['admin', 'voluntario']),
    body('cantidad_kg').optional().isFloat({ min: 0.1 }).withMessage('La cantidad debe ser un número mayor a 0.1 kg'),
    validate
], abonoCrud.update);

// DELETE: Eliminar registro (Solo Admin)
router.delete('/:id', checkRole(['admin']), abonoCrud.delete);

module.exports = router;

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

// --- Rutas ---

// GET: Todos los abonos
router.get('/', abonoCrud.getAll);

// GET: Un registro específico
router.get('/:id', abonoCrud.getById);

// POST: Registrar nuevo abono
router.post('/', [
    body('arbol_id').isInt().withMessage('ID de árbol no válido'),
    body('voluntario_id').isInt().withMessage('ID de voluntario no válido'),
    body('cantidad_kg').isFloat({ min: 0.1 }).withMessage('La cantidad debe ser un número mayor a 0.1 kg'),
    validate
], abonoCrud.create);

// PUT: Actualizar registro
router.put('/:id', [
    body('cantidad_kg').optional().isFloat({ min: 0.1 }).withMessage('La cantidad debe ser un número mayor a 0.1 kg'),
    validate
], abonoCrud.update);

// DELETE: Eliminar registro
router.delete('/:id', abonoCrud.delete);

module.exports = router;

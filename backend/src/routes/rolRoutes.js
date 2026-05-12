const express = require('express');
const router = express.Router();
const rolCrud = require('../cruds/rolCrud');
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

// GET: Todos los roles
router.get('/', rolCrud.getAll);

// GET: Un rol por ID
router.get('/:id', rolCrud.getById);

// POST: Crear nuevo rol
router.post('/', [
    body('nombre').notEmpty().withMessage('El nombre del rol es obligatorio'),
    validate
], rolCrud.create);

// PUT: Actualizar rol
router.put('/:id', [
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    validate
], rolCrud.update);

// DELETE: Eliminar rol
router.delete('/:id', rolCrud.delete);

module.exports = router;

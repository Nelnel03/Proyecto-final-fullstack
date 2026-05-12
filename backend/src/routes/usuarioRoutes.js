const express = require('express');
const router = express.Router();
const usuarioCrud = require('../cruds/usuarioCrud');
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

// --- Definición de Rutas ---

// GET: Obtener todos los usuarios
router.get('/', usuarioCrud.getAll);

// GET: Obtener un usuario por ID
router.get('/:id', usuarioCrud.getById);

// POST: Crear un nuevo usuario (con validación básica)
router.post('/', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
    body('rol_id').isInt().withMessage('El ID de rol debe ser un número entero'),
    validate
], usuarioCrud.create);

// PUT: Actualizar un usuario
router.put('/:id', [
    body('email').optional().isEmail().withMessage('Debe ser un correo electrónico válido'),
    validate
], usuarioCrud.update);

// DELETE: Eliminar un usuario
router.delete('/:id', usuarioCrud.delete);

module.exports = router;

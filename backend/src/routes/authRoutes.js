const express = require('express');
const router = express.Router();
const authCrud = require('../cruds/authCrud');
const { body, validationResult } = require('express-validator');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');

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

// --- Rutas Públicas ---

// POST: Login
router.post('/login', authLimiter, [
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validate
], authCrud.login);

// POST: Registro
router.post('/register', authLimiter, [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    validate
], authCrud.register);

module.exports = router;

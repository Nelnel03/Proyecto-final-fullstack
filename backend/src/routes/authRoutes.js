const express = require('express');
const router = express.Router();
const authCrud = require('../cruds/authCrud');
const { body, validationResult } = require('express-validator');
const { authLimiter } = require('../middlewares/rateLimitMiddleware');
const { verifyToken } = require('../middlewares/authMiddleware');

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

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

// POST: Solicitar recuperación de contraseña
router.post('/forgot-password', authLimiter, [
    body('email').isEmail().withMessage('Email no válido'),
    validate
], authCrud.forgotPassword);

// POST: Restablecer contraseña con token
router.post('/reset-password', [
    body('token').notEmpty().withMessage('Token requerido'),
    body('newPassword').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
    validate
], authCrud.resetPassword);

// POST: Cambiar contraseña (requiere estar autenticado)
router.post('/change-password', verifyToken, [
    body('newPassword').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    validate
], authCrud.changePassword);

module.exports = router;

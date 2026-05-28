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

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Autenticación, registro y recuperación de contraseñas.
 */

// POST: Login
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve JWT.
 *       401:
 *         description: Credenciales inválidas.
 */
router.post('/login', authLimiter, [
    body('email').isEmail().withMessage('Email no válido'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria'),
    validate
], authCrud.login);

// POST: Registro
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado.
 *       400:
 *         description: Error de validación.
 */
router.post('/register', authLimiter, [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email no válido'),
    body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    validate
], authCrud.register);

// POST: Solicitar recuperación de contraseña
/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: Solicitar token de recuperación de contraseña
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Correo de recuperación enviado.
 *       404:
 *         description: Usuario no encontrado.
 */
router.post('/forgot-password', authLimiter, [
    body('email').isEmail().withMessage('Email no válido'),
    validate
], authCrud.forgotPassword);

// POST: Restablecer contraseña con token
/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: Restablecer contraseña con token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña restablecida.
 *       400:
 *         description: Token inválido o expirado.
 */
router.post('/reset-password', [
    body('token').notEmpty().withMessage('Token requerido'),
    body('newPassword').isLength({ min: 8 }).withMessage('Mínimo 8 caracteres'),
    validate
], authCrud.resetPassword);

// GET: Perfil del usuario autenticado (rol fresco desde DB)
/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario.
 *       401:
 *         description: No autorizado.
 */
router.get('/me', verifyToken, authCrud.me);

// POST: Logout — revoca la sesión activa del token
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cerrar sesión
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sesión cerrada.
 *       401:
 *         description: No autorizado.
 */
router.post('/logout', verifyToken, authCrud.logout);

// POST: Cambiar contraseña (requiere estar autenticado)
/**
 * @swagger
 * /api/auth/change-password:
 *   post:
 *     summary: Cambiar contraseña
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña cambiada.
 *       401:
 *         description: No autorizado.
 */
router.post('/change-password', verifyToken, [
    body('newPassword').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
    validate
], authCrud.changePassword);

module.exports = router;

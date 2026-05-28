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

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles (Solo Admin).
 */

// --- Rutas (Protegidas por Admin) ---
router.use(verifyToken, checkRole(['admin']));

/**
 * @swagger
 * /api/roles:
 *   get:
 *     summary: Obtener todos los roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles.
 *       401:
 *         description: No autorizado.
 */
// GET: Todos los roles
router.get('/', rolCrud.getAll);

/**
 * @swagger
 * /api/roles/{id}:
 *   get:
 *     summary: Obtener un rol por ID
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol encontrado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Rol no encontrado.
 */
// GET: Un rol por ID
router.get('/:id', rolCrud.getById);

/**
 * @swagger
 * /api/roles:
 *   post:
 *     summary: Crear un nuevo rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rol creado.
 *       401:
 *         description: No autorizado.
 */
// POST: Crear nuevo rol
router.post('/', [
    body('nombre').notEmpty().withMessage('El nombre del rol es obligatorio'),
    validate
], rolCrud.create);

/**
 * @swagger
 * /api/roles/{id}:
 *   put:
 *     summary: Actualizar un rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rol actualizado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Rol no encontrado.
 */
// PUT: Actualizar rol
router.put('/:id', [
    body('nombre').optional().notEmpty().withMessage('El nombre no puede estar vacío'),
    validate
], rolCrud.update);

/**
 * @swagger
 * /api/roles/{id}:
 *   delete:
 *     summary: Eliminar un rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol eliminado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Rol no encontrado.
 */
// DELETE: Eliminar rol
router.delete('/:id', rolCrud.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const tareaCrud = require('../cruds/tareaCrud');
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
 *   name: Tareas
 *   description: Catálogo de tareas de voluntariado.
 */

// --- Rutas ---

/**
 * @swagger
 * /api/tareas:
 *   get:
 *     summary: Listar todas las tareas
 *     tags: [Tareas]
 *     responses:
 *       200:
 *         description: Lista de tareas.
 */
// GET: Listar tareas (Público)
router.get('/', tareaCrud.getAll);

/**
 * @swagger
 * /api/tareas/{id}:
 *   get:
 *     summary: Obtener tarea por ID
 *     tags: [Tareas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tarea encontrada.
 *       404:
 *         description: Tarea no encontrada.
 */
// GET: Una tarea (Público)
router.get('/:id', tareaCrud.getById);

// Solo el ADMIN puede modificar el catálogo de tareas
router.use(verifyToken, checkRole(['admin']));

/**
 * @swagger
 * /api/tareas:
 *   post:
 *     summary: Crear una nueva tarea
 *     tags: [Tareas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               horas:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Tarea creada.
 *       401:
 *         description: No autorizado.
 */
// POST: Crear tarea
router.post('/', [
    body('titulo').notEmpty().withMessage('El título es obligatorio'),
    body('horas').optional().isFloat({ min: 0.5 }).withMessage('La duración debe ser al menos 0.5 horas'),
    validate
], tareaCrud.create);

/**
 * @swagger
 * /api/tareas/{id}:
 *   put:
 *     summary: Actualizar una tarea
 *     tags: [Tareas]
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
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Tarea actualizada.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Tarea no encontrada.
 */
// PUT: Editar tarea
router.put('/:id', [
    body('titulo').optional().notEmpty().withMessage('El título no puede estar vacío'),
    validate
], tareaCrud.update);

/**
 * @swagger
 * /api/tareas/{id}:
 *   delete:
 *     summary: Eliminar tarea
 *     tags: [Tareas]
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
 *         description: Tarea eliminada.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Tarea no encontrada.
 */
// DELETE: Borrar tarea
router.delete('/:id', tareaCrud.delete);

module.exports = router;

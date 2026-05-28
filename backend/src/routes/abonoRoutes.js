const express = require('express');
const router = express.Router();
const abonoCrud = require('../cruds/abonoCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Abonos
 *   description: Gestión del inventario de abonos y recursos.
 */

// --- Rutas ---

/**
 * @swagger
 * /api/abonos:
 *   get:
 *     summary: Obtener todos los abonos
 *     tags: [Abonos]
 *     responses:
 *       200:
 *         description: Lista de abonos.
 */
// GET: Todos los abonos (Público)
router.get('/', abonoCrud.getAll);

/**
 * @swagger
 * /api/abonos/{id}:
 *   get:
 *     summary: Obtener un abono por ID
 *     tags: [Abonos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Abono encontrado.
 *       404:
 *         description: Abono no encontrado.
 */
// GET: Un registro específico (Público)
router.get('/:id', abonoCrud.getById);

// Rutas protegidas
router.use(verifyToken);

/**
 * @swagger
 * /api/abonos:
 *   post:
 *     summary: Crear un nuevo abono
 *     tags: [Abonos]
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
 *               cantidad:
 *                 type: number
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Abono creado.
 *       401:
 *         description: No autorizado.
 */
// POST: Registrar nuevo abono / producto de inventario (Admin y Voluntario)
router.post('/', checkRole(['admin', 'voluntario']), abonoCrud.create);

/**
 * @swagger
 * /api/abonos/{id}:
 *   put:
 *     summary: Actualizar un abono
 *     tags: [Abonos]
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
 *               cantidad:
 *                 type: number
 *               descripcion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Abono actualizado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Abono no encontrado.
 */
// PUT: Actualizar registro (Admin y Voluntario)
router.put('/:id', checkRole(['admin', 'voluntario']), abonoCrud.update);

/**
 * @swagger
 * /api/abonos/{id}:
 *   delete:
 *     summary: Eliminar un abono
 *     tags: [Abonos]
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
 *         description: Abono eliminado exitosamente.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Abono no encontrado.
 */
// DELETE: Eliminar registro (Solo Admin)
router.delete('/:id', checkRole(['admin']), abonoCrud.delete);

module.exports = router;

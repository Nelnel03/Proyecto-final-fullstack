const express = require('express');
const router = express.Router();
const statsCrud = require('../cruds/statsCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Estadisticas
 *   description: Gestión y recálculo de estadísticas del sistema (Solo Admin).
 */

router.use(verifyToken, checkRole(['admin']));

/**
 * @swagger
 * /api/stats/recalcular:
 *   post:
 *     summary: Recalcular estadísticas globales
 *     tags: [Estadisticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas recalculadas y guardadas.
 *       401:
 *         description: No autorizado.
 */
router.post('/recalcular', statsCrud.recalcular);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Obtener todas las estadísticas
 *     tags: [Estadisticas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estadísticas.
 */
router.get('/', statsCrud.getAll);

/**
 * @swagger
 * /api/stats/{id}:
 *   get:
 *     summary: Obtener estadística por ID
 *     tags: [Estadisticas]
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
 *         description: Estadística encontrada.
 */
router.get('/:id', statsCrud.getById);

/**
 * @swagger
 * /api/stats:
 *   post:
 *     summary: Crear estadística manualmente
 *     tags: [Estadisticas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               total_usuarios:
 *                 type: integer
 *               total_voluntarios:
 *                 type: integer
 *               total_arboles:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Estadística creada.
 */
router.post('/', statsCrud.create);

/**
 * @swagger
 * /api/stats/{id}:
 *   put:
 *     summary: Actualizar estadística
 *     tags: [Estadisticas]
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
 *               total_usuarios:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Estadística actualizada.
 */
router.put('/:id', statsCrud.update);

/**
 * @swagger
 * /api/stats/{id}:
 *   delete:
 *     summary: Eliminar estadística
 *     tags: [Estadisticas]
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
 *         description: Estadística eliminada.
 */
router.delete('/:id', statsCrud.delete);

module.exports = router;

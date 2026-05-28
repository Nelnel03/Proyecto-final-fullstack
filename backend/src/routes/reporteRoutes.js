const express = require('express');
const router = express.Router();
const reporteCrud = require('../cruds/reporteCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Reportes de problemas, robos o alertas de árboles.
 */

router.use(verifyToken);

/**
 * @swagger
 * /api/reportes:
 *   get:
 *     summary: Obtener reportes
 *     description: Admin ve todos; usuarios/voluntarios ven solo los suyos.
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes.
 *       401:
 *         description: No autorizado.
 */
// GET: Admin ve todos; usuarios/voluntarios ven solo los suyos
router.get('/', checkRole(['admin', 'voluntario', 'usuario']), reporteCrud.getAll);

/**
 * @swagger
 * /api/reportes/{id}:
 *   get:
 *     summary: Obtener un reporte por ID
 *     tags: [Reportes]
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
 *         description: Reporte encontrado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Reporte no encontrado.
 */
// GET: Un reporte por ID
router.get('/:id', checkRole(['admin', 'voluntario', 'usuario']), reporteCrud.getById);

/**
 * @swagger
 * /api/reportes:
 *   post:
 *     summary: Crear un reporte
 *     tags: [Reportes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               arbol_id:
 *                 type: integer
 *               tipo_reporte:
 *                 type: string
 *                 example: "robo"
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reporte creado.
 *       401:
 *         description: No autorizado.
 */
// POST: Crear reporte (cualquier rol autenticado)
router.post('/', checkRole(['admin', 'voluntario', 'usuario']), reporteCrud.create);

/**
 * @swagger
 * /api/reportes/{id}:
 *   put:
 *     summary: Actualizar un reporte
 *     tags: [Reportes]
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
 *               tipo_reporte:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reporte actualizado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Reporte no encontrado.
 */
// PUT / DELETE: Solo Admin
router.put('/:id', checkRole(['admin']), reporteCrud.update);

/**
 * @swagger
 * /api/reportes/{id}:
 *   delete:
 *     summary: Eliminar un reporte
 *     tags: [Reportes]
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
 *         description: Reporte eliminado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Reporte no encontrado.
 */
router.delete('/:id', checkRole(['admin']), reporteCrud.delete);

module.exports = router;

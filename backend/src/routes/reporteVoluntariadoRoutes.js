const express = require('express');
const router = express.Router();
const reporteVoluntariadoCrud = require('../cruds/reporteVoluntariadoCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: ReportesVoluntariado
 *   description: Reportes de actividades de los voluntarios.
 */

router.use(verifyToken);

/**
 * @swagger
 * /api/reportes-voluntariado:
 *   get:
 *     summary: Obtener reportes de voluntariado
 *     description: Admin ve todos; voluntario ve solo los suyos.
 *     tags: [ReportesVoluntariado]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes.
 *       401:
 *         description: No autorizado.
 */
// GET: Admin ve todos; voluntario ve solo los suyos
router.get('/', checkRole(['admin', 'voluntario']), reporteVoluntariadoCrud.getAll);

/**
 * @swagger
 * /api/reportes-voluntariado/{id}:
 *   get:
 *     summary: Obtener un reporte por ID
 *     tags: [ReportesVoluntariado]
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
router.get('/:id', checkRole(['admin', 'voluntario']), reporteVoluntariadoCrud.getById);

/**
 * @swagger
 * /api/reportes-voluntariado:
 *   post:
 *     summary: Crear reporte de voluntariado
 *     tags: [ReportesVoluntariado]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tarea_id:
 *                 type: integer
 *               horas_trabajadas:
 *                 type: number
 *               comentarios:
 *                 type: string
 *     responses:
 *       201:
 *         description: Reporte creado.
 *       401:
 *         description: No autorizado.
 */
// POST: Enviar reporte (Admin y Voluntario, sin validators estrictos)
router.post('/', checkRole(['admin', 'voluntario']), reporteVoluntariadoCrud.create);

/**
 * @swagger
 * /api/reportes-voluntariado/{id}:
 *   put:
 *     summary: Actualizar un reporte de voluntariado
 *     tags: [ReportesVoluntariado]
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
 *               horas_trabajadas:
 *                 type: number
 *               comentarios:
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
// PUT: Actualizar estado (Solo Admin)
router.put('/:id', checkRole(['admin']), reporteVoluntariadoCrud.update);

/**
 * @swagger
 * /api/reportes-voluntariado/{id}:
 *   delete:
 *     summary: Eliminar reporte de voluntariado
 *     tags: [ReportesVoluntariado]
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
// DELETE: Solo Admin
router.delete('/:id', checkRole(['admin']), reporteVoluntariadoCrud.delete);

module.exports = router;

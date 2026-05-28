const express = require('express');
const router = express.Router();
const solicitudCrud = require('../cruds/solicitudCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Solicitudes
 *   description: Gestión de solicitudes para ser voluntario.
 */

router.use(verifyToken);

/**
 * @swagger
 * /api/solicitudes:
 *   get:
 *     summary: Obtener solicitudes
 *     description: Admin ve todas; usuario/voluntario ve solo las suyas.
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de solicitudes.
 *       401:
 *         description: No autorizado.
 */
// GET: Admin ve todas; usuario/voluntario ve solo las suyas
router.get('/', checkRole(['admin', 'voluntario', 'usuario']), solicitudCrud.getAll);

/**
 * @swagger
 * /api/solicitudes/{id}:
 *   get:
 *     summary: Obtener una solicitud por ID
 *     tags: [Solicitudes]
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
 *         description: Solicitud encontrada.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Solicitud no encontrada.
 */
// GET: Una solicitud por ID
router.get('/:id', checkRole(['admin', 'voluntario', 'usuario']), solicitudCrud.getById);

/**
 * @swagger
 * /api/solicitudes:
 *   post:
 *     summary: Crear nueva solicitud
 *     tags: [Solicitudes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               motivo:
 *                 type: string
 *               experiencia:
 *                 type: string
 *     responses:
 *       201:
 *         description: Solicitud creada.
 *       401:
 *         description: No autorizado.
 */
// POST: Crear nueva solicitud (cualquier usuario autenticado)
router.post('/', checkRole(['admin', 'voluntario', 'usuario']), solicitudCrud.create);

/**
 * @swagger
 * /api/solicitudes/{id}/aprobar:
 *   post:
 *     summary: Aprobar solicitud y promover a voluntario
 *     tags: [Solicitudes]
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
 *         description: Solicitud aprobada y rol actualizado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Solicitud no encontrada.
 */
// POST: Aprobar solicitud — actualiza estado Y cambia rol del usuario a voluntario (Solo Admin)
router.post('/:id/aprobar', checkRole(['admin']), solicitudCrud.aprobar);

/**
 * @swagger
 * /api/solicitudes/{id}:
 *   put:
 *     summary: Actualizar estado de solicitud
 *     tags: [Solicitudes]
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
 *               estado:
 *                 type: string
 *                 example: "rechazado"
 *     responses:
 *       200:
 *         description: Solicitud actualizada.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Solicitud no encontrada.
 */
// PUT: Actualizar estado (Solo Admin)
router.put('/:id', checkRole(['admin']), solicitudCrud.update);

/**
 * @swagger
 * /api/solicitudes/{id}:
 *   delete:
 *     summary: Eliminar solicitud
 *     tags: [Solicitudes]
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
 *         description: Solicitud eliminada.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Solicitud no encontrada.
 */
// DELETE: Eliminar solicitud (Solo Admin)
router.delete('/:id', checkRole(['admin']), solicitudCrud.delete);

module.exports = router;

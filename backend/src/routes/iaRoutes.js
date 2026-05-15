const express = require('express');
const router = express.Router();
const iaCrud = require('../cruds/iaCrud');
const { verifyToken } = require('../middlewares/authMiddleware');

/**
 * @swagger
 * /api/ia/analisis:
 *   post:
 *     summary: Analizar el estado de un árbol mediante IA
 *     tags: [IA]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *                 example: "El árbol tiene las hojas amarillentas y pequeñas manchas blancas en el tronco."
 *     responses:
 *       200:
 *         description: Análisis completado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error en el servidor o API Key no configurada
 */
router.post('/analisis', verifyToken, iaCrud.analyzeTreeState);

module.exports = router;

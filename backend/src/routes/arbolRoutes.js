const express = require('express');
const router = express.Router();
const arbolCrud = require('../cruds/arbolCrud');
const arbolValidator = require('../validators/arbolValidator');
const validateResults = require('../middlewares/validateMiddleware');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { uploadArbol } = require('../utils/cloudinaryConfig');

/**
 * @swagger
 * tags:
 *   name: Arboles
 *   description: Operaciones sobre los árboles y la flora.
 */

// --- Definición de Rutas ---

/**
 * @swagger
 * /api/arboles:
 *   get:
 *     summary: Obtener todos los árboles
 *     tags: [Arboles]
 *     responses:
 *       200:
 *         description: Lista de árboles.
 */
// GET: Todos los árboles (Público)
router.get('/', arbolCrud.getAll);

/**
 * @swagger
 * /api/arboles/{id}:
 *   get:
 *     summary: Obtener un árbol por ID
 *     tags: [Arboles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Árbol encontrado.
 *       404:
 *         description: Árbol no encontrado.
 */
// GET: Detalle de un árbol (Público)
router.get('/:id', arbolCrud.getById);

// Rutas protegidas (Requieren Login y Rol específico)
router.use(verifyToken);

/**
 * @swagger
 * /api/arboles:
 *   post:
 *     summary: Registrar un nuevo árbol
 *     tags: [Arboles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Árbol creado.
 *       401:
 *         description: No autorizado.
 */
// POST: Registrar un nuevo árbol (Admin y Voluntario)
router.post('/', [
    checkRole(['admin', 'voluntario']),
    uploadArbol.single('imagen'),
    arbolValidator,
    validateResults
], arbolCrud.create);

/**
 * @swagger
 * /api/arboles/{id}:
 *   put:
 *     summary: Actualizar un árbol
 *     tags: [Arboles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               imagen:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Árbol actualizado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Árbol no encontrado.
 */
// PUT: Actualizar un árbol (Admin y Voluntario)
router.put('/:id', [
    checkRole(['admin', 'voluntario']),
    uploadArbol.single('imagen'),
    arbolValidator, 
    validateResults
], arbolCrud.update);

/**
 * @swagger
 * /api/arboles/{id}:
 *   delete:
 *     summary: Eliminar un árbol
 *     tags: [Arboles]
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
 *         description: Árbol eliminado.
 *       401:
 *         description: No autorizado.
 *       404:
 *         description: Árbol no encontrado.
 */
// DELETE: Eliminar un árbol (Solo Admin)
router.delete('/:id', checkRole(['admin']), arbolCrud.delete);

module.exports = router;

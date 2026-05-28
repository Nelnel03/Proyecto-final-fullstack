const express = require('express');
const router = express.Router();
const usuarioCrud = require('../cruds/usuarioCrud');
const usuarioValidator = require('../validators/usuarioValidator');
const usuarioUpdateValidator = require('../validators/usuarioUpdateValidator');
const validateResults = require('../middlewares/validateMiddleware');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { uploadProfile } = require('../utils/cloudinaryConfig');

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios del sistema.
 */

// --- Definición de Rutas (Protegidas) ---

/**
 * @swagger
 * /api/usuarios/perfil/foto:
 *   post:
 *     summary: Actualizar foto de perfil
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto actualizada exitosamente.
 *       400:
 *         description: Error en la subida.
 *       401:
 *         description: No autorizado.
 */
// Ruta para que el usuario actual actualice su propia foto de perfil
router.post('/perfil/foto', verifyToken, uploadProfile.single('foto'), usuarioCrud.updateProfilePhoto);

// Solo el ADMIN puede gestionar usuarios
router.use(verifyToken, checkRole(['admin']));

/**
 * @swagger
 * /api/usuarios:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios.
 *       401:
 *         description: No autorizado.
 */
// GET: Obtener todos los usuarios
router.get('/', usuarioCrud.getAll);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   get:
 *     summary: Obtener un usuario por ID
 *     tags: [Usuarios]
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
 *         description: Usuario encontrado.
 *       404:
 *         description: Usuario no encontrado.
 */
// GET: Obtener un usuario por ID
router.get('/:id', usuarioCrud.getById);

/**
 * @swagger
 * /api/usuarios:
 *   post:
 *     summary: Crear un nuevo usuario (Solo Admin)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rol_id:
 *                 type: integer
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Usuario creado.
 */
// POST: Crear un nuevo usuario
router.post('/', [
    uploadProfile.single('fotoPerfil'),
    usuarioValidator,
    validateResults
], usuarioCrud.create);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   put:
 *     summary: Actualizar un usuario (Solo Admin)
 *     tags: [Usuarios]
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               rol_id:
 *                 type: integer
 *               fotoPerfil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Usuario actualizado.
 */
// PUT: Actualizar un usuario
router.put('/:id', [
    uploadProfile.single('fotoPerfil'),
    usuarioUpdateValidator,
    validateResults
], usuarioCrud.update);

/**
 * @swagger
 * /api/usuarios/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Usuarios]
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
 *         description: Usuario eliminado.
 */
// DELETE: Eliminar un usuario
router.delete('/:id', usuarioCrud.delete);

module.exports = router;

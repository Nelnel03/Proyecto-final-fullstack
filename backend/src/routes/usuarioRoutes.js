const express = require('express');
const router = express.Router();
const usuarioCrud = require('../cruds/usuarioCrud');
const usuarioValidator = require('../validators/usuarioValidator');
const validateResults = require('../middlewares/validateMiddleware');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');
const { uploadProfile } = require('../utils/cloudinaryConfig');

// --- Definición de Rutas (Protegidas) ---

// Ruta para que el usuario actual actualice su propia foto de perfil
router.post('/perfil/foto', verifyToken, uploadProfile.single('foto'), usuarioCrud.updateProfilePhoto);

// Solo el ADMIN puede gestionar usuarios
router.use(verifyToken, checkRole(['admin']));

// GET: Obtener todos los usuarios
router.get('/', usuarioCrud.getAll);

// GET: Obtener un usuario por ID
router.get('/:id', usuarioCrud.getById);

// POST: Crear un nuevo usuario
router.post('/', [
    uploadProfile.single('fotoPerfil'),
    usuarioValidator,
    validateResults
], usuarioCrud.create);

// PUT: Actualizar un usuario
router.put('/:id', [
    uploadProfile.single('fotoPerfil'),
    usuarioValidator,
    validateResults
], usuarioCrud.update);

// DELETE: Eliminar un usuario
router.delete('/:id', usuarioCrud.delete);

module.exports = router;

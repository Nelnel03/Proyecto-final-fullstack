const express = require('express');
const router = express.Router();
const usuarioCrud = require('../cruds/usuarioCrud');
const usuarioValidator = require('../validators/usuarioValidator');
const validateResults = require('../middlewares/validateMiddleware');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// --- Definición de Rutas (Protegidas) ---

// Solo el ADMIN puede gestionar usuarios
router.use(verifyToken, checkRole(['admin']));

// GET: Obtener todos los usuarios
router.get('/', usuarioCrud.getAll);

// GET: Obtener un usuario por ID
router.get('/:id', usuarioCrud.getById);

// POST: Crear un nuevo usuario
router.post('/', [
    usuarioValidator,
    validateResults
], usuarioCrud.create);

// PUT: Actualizar un usuario
router.put('/:id', [
    usuarioValidator,
    validateResults
], usuarioCrud.update);

// DELETE: Eliminar un usuario
router.delete('/:id', usuarioCrud.delete);

module.exports = router;

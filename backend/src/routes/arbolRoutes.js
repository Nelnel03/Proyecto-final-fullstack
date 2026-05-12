const express = require('express');
const router = express.Router();
const arbolCrud = require('../cruds/arbolCrud');
const arbolValidator = require('../validators/arbolValidator');
const validateResults = require('../middlewares/validateMiddleware');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// --- Definición de Rutas ---

// GET: Todos los árboles (Público)
router.get('/', arbolCrud.getAll);

// GET: Detalle de un árbol (Público)
router.get('/:id', arbolCrud.getById);

// Rutas protegidas (Requieren Login y Rol específico)
router.use(verifyToken);

// POST: Registrar un nuevo árbol (Admin y Voluntario)
router.post('/', [
    checkRole(['admin', 'voluntario']),
    arbolValidator,
    validateResults
], arbolCrud.create);

// PUT: Actualizar un árbol (Admin y Voluntario)
router.put('/:id', [
    checkRole(['admin', 'voluntario']),
    arbolValidator, 
    validateResults
], arbolCrud.update);

// DELETE: Eliminar un árbol (Solo Admin)
router.delete('/:id', checkRole(['admin']), arbolCrud.delete);

module.exports = router;

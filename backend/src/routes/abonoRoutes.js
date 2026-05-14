const express = require('express');
const router = express.Router();
const abonoCrud = require('../cruds/abonoCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// --- Rutas ---

// GET: Todos los abonos (Público)
router.get('/', abonoCrud.getAll);

// GET: Un registro específico (Público)
router.get('/:id', abonoCrud.getById);

// Rutas protegidas
router.use(verifyToken);

// POST: Registrar nuevo abono / producto de inventario (Admin y Voluntario)
router.post('/', checkRole(['admin', 'voluntario']), abonoCrud.create);

// PUT: Actualizar registro (Admin y Voluntario)
router.put('/:id', checkRole(['admin', 'voluntario']), abonoCrud.update);

// DELETE: Eliminar registro (Solo Admin)
router.delete('/:id', checkRole(['admin']), abonoCrud.delete);

module.exports = router;

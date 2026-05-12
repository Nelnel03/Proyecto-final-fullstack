const express = require('express');
const router = express.Router();
const reporteCrud = require('../cruds/reporteCrud');
const { reporteValidator } = require('../validators/commonValidators');
const validateResults = require('../middlewares/validateMiddleware');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

// --- Rutas ---

// Todas las rutas de reportes requieren estar logueado
router.use(verifyToken);

// GET: Todos los reportes (Solo Admin)
router.get('/', checkRole(['admin']), reporteCrud.getAll);

// GET: Un reporte por ID (Solo Admin)
router.get('/:id', checkRole(['admin']), reporteCrud.getById);

// POST: Crear nuevo reporte (Admin, Voluntario, Usuario)
router.post('/', [
    checkRole(['admin', 'voluntario', 'usuario']),
    reporteValidator,
    validateResults
], reporteCrud.create);

// PUT/DELETE: Solo Admin
router.put('/:id', checkRole(['admin']), [
    reporteValidator,
    validateResults
], reporteCrud.update);

router.delete('/:id', checkRole(['admin']), reporteCrud.delete);

module.exports = router;

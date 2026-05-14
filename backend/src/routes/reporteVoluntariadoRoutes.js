const express = require('express');
const router = express.Router();
const reporteVoluntariadoCrud = require('../cruds/reporteVoluntariadoCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);

// GET: Admin ve todos; voluntario ve solo los suyos
router.get('/', checkRole(['admin', 'voluntario']), reporteVoluntariadoCrud.getAll);

// GET: Un reporte por ID
router.get('/:id', checkRole(['admin', 'voluntario']), reporteVoluntariadoCrud.getById);

// POST: Enviar reporte (Admin y Voluntario, sin validators estrictos)
router.post('/', checkRole(['admin', 'voluntario']), reporteVoluntariadoCrud.create);

// PUT: Actualizar estado (Solo Admin)
router.put('/:id', checkRole(['admin']), reporteVoluntariadoCrud.update);

// DELETE: Solo Admin
router.delete('/:id', checkRole(['admin']), reporteVoluntariadoCrud.delete);

module.exports = router;

const express = require('express');
const router = express.Router();
const reporteCrud = require('../cruds/reporteCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);

// GET: Admin ve todos; usuarios/voluntarios ven solo los suyos
router.get('/', checkRole(['admin', 'voluntario', 'usuario']), reporteCrud.getAll);

// GET: Un reporte por ID
router.get('/:id', checkRole(['admin', 'voluntario', 'usuario']), reporteCrud.getById);

// POST: Crear reporte (cualquier rol autenticado)
router.post('/', checkRole(['admin', 'voluntario', 'usuario']), reporteCrud.create);

// PUT / DELETE: Solo Admin
router.put('/:id', checkRole(['admin']), reporteCrud.update);
router.delete('/:id', checkRole(['admin']), reporteCrud.delete);

module.exports = router;

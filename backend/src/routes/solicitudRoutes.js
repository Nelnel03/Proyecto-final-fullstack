const express = require('express');
const router = express.Router();
const solicitudCrud = require('../cruds/solicitudCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);

// GET: Admin ve todas; usuario/voluntario ve solo las suyas
router.get('/', checkRole(['admin', 'voluntario', 'usuario']), solicitudCrud.getAll);

// GET: Una solicitud por ID
router.get('/:id', checkRole(['admin', 'voluntario', 'usuario']), solicitudCrud.getById);

// POST: Crear nueva solicitud (cualquier usuario autenticado)
router.post('/', checkRole(['admin', 'voluntario', 'usuario']), solicitudCrud.create);

// PUT: Actualizar estado (Solo Admin)
router.put('/:id', checkRole(['admin']), solicitudCrud.update);

// DELETE: Eliminar solicitud (Solo Admin)
router.delete('/:id', checkRole(['admin']), solicitudCrud.delete);

module.exports = router;

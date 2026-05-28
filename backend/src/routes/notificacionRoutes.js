const express = require('express');
const router = express.Router();
const { notificacionController } = require('../cruds/notificacionCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken);

// GET: Resumen de notificaciones no leídas (solo Admin)
router.get('/summary', checkRole(['admin']), notificacionController.getSummary);

// PATCH: Marcar registros específicos como leídos (solo Admin)
router.patch('/mark-read', checkRole(['admin']), notificacionController.markRead);

// PATCH: Marcar TODAS las notificaciones como leídas (solo Admin)
router.patch('/mark-all-read', checkRole(['admin']), notificacionController.markAllRead);

module.exports = router;

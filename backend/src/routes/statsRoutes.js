const express = require('express');
const router = express.Router();
const statsCrud = require('../cruds/statsCrud');
const { verifyToken, checkRole } = require('../middlewares/authMiddleware');

router.use(verifyToken, checkRole(['admin']));

router.post('/recalcular', statsCrud.recalcular);
router.get('/', statsCrud.getAll);
router.get('/:id', statsCrud.getById);
router.post('/', statsCrud.create);
router.put('/:id', statsCrud.update);
router.delete('/:id', statsCrud.delete);

module.exports = router;

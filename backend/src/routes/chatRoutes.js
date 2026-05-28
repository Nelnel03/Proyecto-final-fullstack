const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const chatCrud = require('../cruds/chatCrud');
const { verifyToken } = require('../middlewares/authMiddleware');

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Demasiadas consultas al asistente. Por favor espera un momento.' },
});

router.post('/', verifyToken, chatLimiter, chatCrud.chat);

module.exports = router;

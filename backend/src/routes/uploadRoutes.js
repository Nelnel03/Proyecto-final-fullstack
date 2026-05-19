const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { cloudinary } = require('../utils/cloudinaryConfig');
const { verifyToken } = require('../middlewares/authMiddleware');

// Almacenamiento genérico en Cloudinary para cualquier imagen
const genericStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reforestacion/general',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'gif'],
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }]
  }
});

const uploadGeneric = multer({ storage: genericStorage });

/**
 * POST /api/upload
 * Sube una imagen a Cloudinary y devuelve la URL segura.
 * Requiere autenticación JWT.
 */
router.post('/', verifyToken, uploadGeneric.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No se recibió ningún archivo. Asegúrese de adjuntar una imagen en el campo "image".' });
    }

    const { path: filePath, filename: publicId } = req.file;

    console.log('[UPLOAD OK]', { filePath, publicId });

    return res.status(200).json({
      url: filePath,
      secure_url: filePath,
      public_id: publicId
    });
  } catch (error) {
    console.error('[UPLOAD ERROR]', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return res.status(500).json({
      message: error.message || 'Error al subir la imagen'
    });
  }
});

module.exports = router;

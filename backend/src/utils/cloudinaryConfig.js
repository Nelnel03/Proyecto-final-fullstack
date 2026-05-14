const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración de almacenamiento para perfiles de usuario
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reforestacion/perfiles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
});

// Configuración de almacenamiento para árboles
const arbolStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reforestacion/arboles',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
  }
});

const uploadProfile = multer({ storage: profileStorage });
const uploadArbol = multer({ storage: arbolStorage });

module.exports = {
  cloudinary,
  uploadProfile,
  uploadArbol
};

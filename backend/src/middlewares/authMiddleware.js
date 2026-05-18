const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Sesion } = require('../models');

/**
 * Middlewares de Autenticación y Autorización
 * Enfoque Senior: Seguridad por capas
 */
const authMiddleware = {
    // 1. Verificar si el usuario está autenticado (Token válido + sesión activa)
    verifyToken: async (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
            const sesion = await Sesion.findOne({ where: { token_hash: tokenHash, activa: 1 } });
            if (!sesion) {
                return res.status(401).json({ message: 'Sesión inválida o ya cerrada.' });
            }

            req.user = decoded;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token no válido o expirado.' });
        }
    },

    // 2. Verificar roles (Autorización)
    // Recibe un array de roles permitidos: ['admin', 'voluntario', etc]
    checkRole: (rolesPermitidos) => {
        return (req, res, next) => {
            if (!req.user) {
                return res.status(500).json({ message: 'Error de servidor: Token no verificado.' });
            }

            const userRole = req.user.rol?.toLowerCase();
            if (!userRole) {
                return res.status(403).json({ message: 'Rol de usuario no definido en el token.' });
            }

            if (rolesPermitidos.includes(userRole)) {
                next();
            } else {
                return res.status(403).json({ 
                    message: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}` 
                });
            }
        };
    }
};

module.exports = authMiddleware;

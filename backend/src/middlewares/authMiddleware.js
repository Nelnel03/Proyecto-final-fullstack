const jwt = require('jsonwebtoken');

/**
 * Middlewares de Autenticación y Autorización
 * Enfoque Senior: Seguridad por capas
 */
const authMiddleware = {
    // 1. Verificar si el usuario está autenticado (Token válido)
    verifyToken: (req, res, next) => {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Acceso denegado. No se proporcionó un token.' });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Guardamos los datos del usuario en la petición
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

            // Normalizamos el rol para evitar errores de mayúsculas/minúsculas
            const userRole = req.user.rol.toLowerCase();
            
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

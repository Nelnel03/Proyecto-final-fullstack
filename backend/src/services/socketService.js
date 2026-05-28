const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Sesion } = require('../models');

let io = null;

const socketService = {
    init: (server) => {
        io = new Server(server, {
            cors: {
                origin: (origin, callback) => {
                    const allowedOrigins = [
                        process.env.FRONTEND_URL,
                        'http://localhost:5173',
                        'http://localhost:3000'
                    ].filter(Boolean);
                    const isDev = process.env.NODE_ENV !== 'production';
                    const isLocalhostOrigin = (org) => /^https?:\/\/localhost(:\d+)?$/.test(org);
                    
                    if (!origin || allowedOrigins.includes(origin) || (isDev && isLocalhostOrigin(origin))) {
                        callback(null, true);
                    } else {
                        callback(new Error('Acceso denegado por política CORS'));
                    }
                },
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
            }
        });

        // Middleware de autenticación JWT + Sesión Activa
        io.use(async (socket, next) => {
            try {
                const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.replace('Bearer ', '');
                if (!token) {
                    return next(new Error('Acceso denegado. No se proporcionó un token.'));
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
                const sesion = await Sesion.findOne({ where: { token_hash: tokenHash, activa: 1 } });
                
                if (!sesion) {
                    return next(new Error('Sesión inválida o ya cerrada.'));
                }

                socket.user = decoded;
                next();
            } catch (error) {
                console.error('Socket authentication error:', error.message);
                return next(new Error('Token no válido o expirado.'));
            }
        });

        io.on('connection', (socket) => {
            const userRole = socket.user?.rol?.toLowerCase();
            console.log(`🔌 Cliente conectado: ID=${socket.id}, User=${socket.user?.nombre}, Rol=${userRole}`);

            // Unir a salas según el rol para facilitar la comunicación selectiva
            if (userRole === 'admin') {
                socket.join('admin-room');
                console.log(`👑 Admin ${socket.user?.nombre} unido a admin-room`);
            } else if (userRole === 'voluntario') {
                socket.join('voluntario-room');
            } else {
                socket.join('user-room');
            }

            socket.on('disconnect', () => {
                console.log(`🔌 Cliente desconectado: ID=${socket.id}`);
            });
        });

        console.log('✅ Socket.IO inicializado correctamente.');
        return io;
    },

    getIO: () => {
        return io;
    },

    /**
     * Emite una actualización de notificaciones a todos los admins conectados.
     * @param {Object|null} summary - Resumen de conteos { total, soporte, robos, solicitudes, labores }
     *   Si se provee, se emite como payload en notification:summary (evita fetch adicional en frontend).
     *   Si es null/undefined, solo emite notification:update para recargar manualmente.
     */
    notifyNotificationUpdate: (summary = null) => {
        if (io) {
            if (summary && typeof summary === 'object') {
                // Evento enriquecido con datos — el frontend actualiza el badge sin hacer GET
                console.log('🔔 Emitiendo notification:summary →', summary);
                io.to('admin-room').emit('notification:summary', summary);
            } else {
                // Evento legacy — el frontend hará GET /summary por su cuenta
                console.log('🔔 Emitiendo notification:update en admin-room...');
                io.to('admin-room').emit('notification:update');
            }
        }
    }
};

module.exports = socketService;

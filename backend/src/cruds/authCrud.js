const { Usuario, Rol, ResetToken, Sesion } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

const registrarSesion = async (token, userId, req) => {
    const decoded = jwt.decode(token);
    await Sesion.create({
        usuario_id: userId,
        token_hash: hashToken(token),
        ip: req.headers['x-forwarded-for']?.split(',')[0].trim() || req.ip || null,
        user_agent: req.headers['user-agent'] || null,
        activa: 1,
        expiry: new Date(decoded.exp * 1000)
    });
};

/**
 * CRUD/Controller para Autenticación
 */
const authCrud = {
    // 1. Registro de Usuario (Cualquier nivel)
    register: async (req, res) => {
        try {
            const { nombre, email, password, rol_id, area, telefono } = req.body;

            const existingUser = await Usuario.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'El correo ya está registrado' });
            }

            // El hash ocurre automáticamente en el modelo (Hooks)
            const user = await Usuario.create({
                nombre,
                email,
                password, // Se envía en texto plano, el hook lo encripta
                rol_id: rol_id || 3, 
                area,
                telefono,
                fechaIngreso: new Date()
            });

            const token = jwt.sign(
                { id: user.id, email: user.email, rol_id: user.rol_id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            await registrarSesion(token, user.id, req);

            return res.status(201).json({
                message: 'Registro exitoso',
                token,
                user: { id: user.id, nombre: user.nombre, email: user.email, rol_id: user.rol_id }
            });
        } catch (error) {
            console.error('Error en register:', error);
            return res.status(500).json({ message: 'Error en el servidor durante el registro' });
        }
    },

    // 2. Login de Usuario
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const user = await Usuario.findOne({ 
                where: { email },
                include: [{ model: Rol, as: 'rol', attributes: ['nombre'] }]
            });

            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            if (user.status === 'baneado') {
                return res.status(403).json({
                    message: 'Cuenta suspendida',
                    status: 'baneado',
                    motivoBan: user.motivoBan
                });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Generar Token con el rol incluido
            const token = jwt.sign(
                { id: user.id, email: user.email, rol: user.rol.nombre, rol_id: user.rol_id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            await registrarSesion(token, user.id, req);

            return res.status(200).json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    telefono: user.telefono,
                    rol: user.rol.nombre,
                    rol_id: user.rol_id,
                    status: user.status,
                    motivoBan: user.motivoBan,
                    debeCambiarPassword: user.debeCambiarPassword,
                    fotoPerfil: user.fotoPerfil
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({ message: 'Error en el servidor durante el login' });
        }
    },

    // 3. Cambio de contraseña (primer login de voluntario)
    changePassword: async (req, res) => {
        try {
            const { newPassword } = req.body;
            const userId = req.user.id;

            if (!newPassword || newPassword.length < 6) {
                return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
            }

            const user = await Usuario.findByPk(userId);
            if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

            await user.update({ password: newPassword, debeCambiarPassword: 0 });

            return res.status(200).json({ message: 'Contraseña actualizada correctamente' });
        } catch (error) {
            console.error('Error en changePassword:', error);
            return res.status(500).json({ message: 'Error al cambiar la contraseña' });
        }
    },

    // 4. Solicitud de recuperación de contraseña
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;

            const user = await Usuario.findOne({ where: { email } });

            if (!user) {
                return res.status(200).json({ message: 'Si el correo existe, recibirás instrucciones.' });
            }

            await ResetToken.destroy({ where: { usuario_id: user.id } });

            const token = crypto.randomBytes(32).toString('hex');
            const expiry = new Date(Date.now() + 3600000);

            await ResetToken.create({ usuario_id: user.id, token, expiry });

            return res.status(200).json({
                message: 'Si el correo existe, recibirás instrucciones.',
                token,
                nombre: user.nombre,
                email: user.email
            });
        } catch (error) {
            console.error('Error en forgotPassword:', error);
            return res.status(500).json({ message: 'Error en el servidor' });
        }
    },

    // 5. Logout — revoca la sesión activa del token actual
    logout: async (req, res) => {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) return res.status(400).json({ message: 'Token no proporcionado' });

            await Sesion.update(
                { activa: 0 },
                { where: { token_hash: hashToken(token), activa: 1 } }
            );

            return res.status(200).json({ message: 'Sesión cerrada correctamente' });
        } catch (error) {
            console.error('Error en logout:', error);
            return res.status(500).json({ message: 'Error al cerrar sesión' });
        }
    },

    // 6. Restablecimiento de contraseña con token
    resetPassword: async (req, res) => {
        try {
            const { token, newPassword } = req.body;

            if (!newPassword || newPassword.length < 8) {
                return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
            }

            const resetToken = await ResetToken.findOne({
                where: { token, usado: 0 },
                include: [{ model: Usuario }]
            });

            if (!resetToken) {
                return res.status(400).json({ message: 'El enlace de recuperación es inválido o ya fue utilizado.' });
            }

            if (new Date() > new Date(resetToken.expiry)) {
                return res.status(400).json({ message: 'El enlace de recuperación ha expirado.' });
            }

            const user = resetToken.Usuario;
            await user.update({ password: newPassword });
            await resetToken.update({ usado: 1 });

            return res.status(200).json({ message: 'Contraseña actualizada correctamente.' });
        } catch (error) {
            console.error('Error en resetPassword:', error);
            return res.status(500).json({ message: 'Error al restablecer la contraseña.' });
        }
    }
};

module.exports = authCrud;

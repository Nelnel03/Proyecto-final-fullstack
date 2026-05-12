const { Usuario, Rol } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
                rol_id: rol_id || 4, 
                area,
                telefono,
                fechaIngreso: new Date()
            });

            const token = jwt.sign(
                { id: user.id, email: user.email, rol_id: user.rol_id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

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
                include: [{ model: Rol, attributes: ['nombre'] }]
            });

            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Usamos el método prototipo del modelo
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Generar Token con el rol incluido
            const token = jwt.sign(
                { id: user.id, email: user.email, rol: user.Rol.nombre, rol_id: user.rol_id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN }
            );

            return res.status(200).json({
                message: 'Login exitoso',
                token,
                user: {
                    id: user.id,
                    nombre: user.nombre,
                    email: user.email,
                    rol: user.Rol.nombre
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            return res.status(500).json({ message: 'Error en el servidor durante el login' });
        }
    }
};

module.exports = authCrud;

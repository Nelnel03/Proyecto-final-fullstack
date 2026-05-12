const { Usuario, Rol } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination');

/**
 * Controller para la gestión de Usuarios
 * Enfoque: Alta disponibilidad y manejo de errores estandarizado.
 */
const usuarioCrud = {
    // 1. Obtener todos los usuarios con Paginación y Filtros
    getAll: async (req, res) => {
        try {
            const { page, size, nombre, email, rol_id, status } = req.query;
            const { limit, offset } = getPagination(page, size);

            // Filtros dinámicos
            const condition = {};
            if (nombre) condition.nombre = { [Op.like]: `%${nombre}%` };
            if (email) condition.email = { [Op.like]: `%${email}%` };
            if (rol_id) condition.rol_id = rol_id;
            if (status) condition.status = status;

            const data = await Usuario.findAndCountAll({
                where: condition,
                limit,
                offset,
                include: [{ model: Rol, attributes: ['nombre'] }],
                attributes: { exclude: ['password'] },
                order: [['fechaIngreso', 'DESC']]
            });

            const response = getPagingData(data, page, limit);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error en getAllUsers:', error);
            return res.status(500).json({ message: 'Error al recuperar usuarios' });
        }
    },

    // 2. Obtener un usuario por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id, {
                include: [{ model: Rol, attributes: ['nombre'] }],
                attributes: { exclude: ['password'] }
            });

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            return res.status(200).json(usuario);
        } catch (error) {
            console.error('Error en getUserById:', error);
            return res.status(500).json({ message: 'Error al recuperar el usuario' });
        }
    },

    // 3. Crear nuevo usuario (Registro)
    create: async (req, res) => {
        try {
            const { nombre, email, password, rol_id, area, telefono } = req.body;

            // Verificar si el email ya existe
            const existingUser = await Usuario.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const nuevoUsuario = await Usuario.create({
                nombre,
                email,
                password: hashedPassword,
                rol_id,
                area,
                telefono,
                fechaIngreso: new Date()
            });

            // No devolver el password en la respuesta
            const userResponse = nuevoUsuario.toJSON();
            delete userResponse.password;

            return res.status(201).json({
                message: 'Usuario creado exitosamente',
                user: userResponse
            });
        } catch (error) {
            console.error('Error en createUser:', error);
            return res.status(500).json({ message: 'Error al crear el usuario' });
        }
    },

    // 4. Actualizar usuario
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, area, telefono, status, rol_id } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Actualizar campos
            await usuario.update({
                nombre: nombre || usuario.nombre,
                area: area || usuario.area,
                telefono: telefono || usuario.telefono,
                status: status || usuario.status,
                rol_id: rol_id || usuario.rol_id
            });

            return res.status(200).json({
                message: 'Usuario actualizado correctamente',
                user: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    status: usuario.status
                }
            });
        } catch (error) {
            console.error('Error en updateUser:', error);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    },

    // 5. Eliminar usuario (Baja lógica o física - aquí física por el SQL original)
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            await usuario.destroy();
            return res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } catch (error) {
            console.error('Error en deleteUser:', error);
            return res.status(500).json({ message: 'Error al eliminar el usuario' });
        }
    }
};

module.exports = usuarioController;

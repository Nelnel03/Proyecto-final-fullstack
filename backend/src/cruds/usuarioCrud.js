const { Usuario, Rol, Sesion, ResetToken, sequelize } = require('../models');
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

    // 3. Crear un nuevo usuario
    create: async (req, res) => {
        try {
            const { nombre, email, password, rol_id, rol, area, telefono, status, debeCambiarPassword } = req.body;

            const emailExiste = await Usuario.findOne({ where: { email } });
            if (emailExiste) {
                return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
            }

            // Normalizar nombre de rol ('user' y 'usuario' son equivalentes)
            const rolNormMap = { user: 'usuario', usuario: 'usuario', voluntario: 'voluntario', admin: 'admin' };
            const rolNormalizado = rol ? (rolNormMap[rol] || rol) : null;

            // Permitir enviar nombre de rol en lugar de rol_id
            let efectivoRolId = rol_id;
            if (!efectivoRolId && rolNormalizado) {
                const rolObj = await Rol.findOne({ where: { nombre: rolNormalizado } });
                if (rolObj) efectivoRolId = rolObj.id;
            }

            // Normalizar status al formato del backend
            const statusMap = { active: 'activo', banned: 'baneado', inactive: 'inactivo' };
            const statusNormalizado = statusMap[status] || status || 'activo';

            const nuevoUsuario = await Usuario.create({
                nombre,
                email,
                password,
                rol_id: efectivoRolId || 4,
                area,
                telefono,
                status: statusNormalizado,
                debeCambiarPassword: debeCambiarPassword ? 1 : 0,
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
            const { nombre, area, telefono, status, rol_id, rol, motivoBan, fotoPerfil, password } = req.body;

            const usuario = await Usuario.findByPk(id);
            if (!usuario) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // Normalizar status al formato del backend
            const statusMap = { active: 'activo', activo: 'activo', banned: 'baneado', baneado: 'baneado', inactive: 'inactivo', inactivo: 'inactivo' };

            // Resolver rol_id si se pasa nombre de rol (normalizar 'user' → 'usuario')
            const rolNormMap = { user: 'usuario', usuario: 'usuario', voluntario: 'voluntario', admin: 'admin' };
            const rolNorm = rol ? (rolNormMap[rol] || rol) : null;
            let efectivoRolId = rol_id;
            if (!efectivoRolId && rolNorm) {
                const rolObj = await Rol.findOne({ where: { nombre: rolNorm } });
                if (rolObj) efectivoRolId = rolObj.id;
            }

            const updateData = {
                nombre: nombre || usuario.nombre,
                area: area !== undefined ? area : usuario.area,
                telefono: telefono !== undefined ? telefono : usuario.telefono,
                rol_id: efectivoRolId || usuario.rol_id
            };

            if (fotoPerfil !== undefined) updateData.fotoPerfil = fotoPerfil;
            if (password && password.trim()) updateData.password = password;

            if (status) {
                updateData.status = statusMap[status] || status;
                if (updateData.status !== 'baneado') {
                    updateData.motivoBan = null;
                }
            }

            if (motivoBan !== undefined) {
                updateData.motivoBan = motivoBan;
            }

            await usuario.update(updateData);

            return res.status(200).json({
                message: 'Usuario actualizado correctamente',
                user: {
                    id: usuario.id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    status: usuario.status,
                    fotoPerfil: usuario.fotoPerfil,
                    rol_id: usuario.rol_id,
                    area: usuario.area,
                    telefono: usuario.telefono
                }
            });
        } catch (error) {
            console.error('Error en updateUser:', error);
            return res.status(500).json({ message: 'Error al actualizar el usuario' });
        }
    },

    // 5. Eliminar usuario (Con Transacción para limpieza de seguridad)
    delete: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const { id } = req.params;
            const usuario = await Usuario.findByPk(id);

            if (!usuario) {
                await t.rollback();
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            // 1. Limpiar sesiones activas
            await Sesion.destroy({ where: { usuario_id: id }, transaction: t });

            // 2. Limpiar tokens de reset
            await ResetToken.destroy({ where: { usuario_id: id }, transaction: t });

            // 3. Eliminar el usuario
            await usuario.destroy({ transaction: t });

            // Confirmar cambios
            await t.commit();
            return res.status(200).json({ message: 'Usuario y sus datos de sesión eliminados correctamente' });
        } catch (error) {
            await t.rollback();
            console.error('Error en deleteUser con Transacción:', error);
            return res.status(500).json({ message: 'Error al eliminar el usuario y sus dependencias.' });
        }
    }
};

module.exports = usuarioCrud;

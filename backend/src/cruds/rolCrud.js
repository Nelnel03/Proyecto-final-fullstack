const { Rol, Usuario } = require('../models');

/**
 * Controller para la gestión de Roles de Usuario
 */
const rolController = {
    // 1. Listar todos los roles
    getAll: async (req, res) => {
        try {
            const roles = await Rol.findAll({
                include: [{ model: Usuario, attributes: ['id'] }] // Ver impacto (conteo)
            });
            
            // Mapear para devolver el conteo de usuarios por rol
            const rolesConConteo = roles.map(rol => ({
                id: rol.id,
                nombre: rol.nombre,
                descripcion: rol.descripcion,
                totalUsuarios: rol.usuarios.length,
                created_at: rol.created_at
            }));

            return res.status(200).json(rolesConConteo);
        } catch (error) {
            console.error('Error en getAllRoles:', error);
            return res.status(500).json({ message: 'Error al recuperar los roles' });
        }
    },

    // 2. Obtener un rol por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const rol = await Rol.findByPk(id);

            if (!rol) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            return res.status(200).json(rol);
        } catch (error) {
            console.error('Error en getRolById:', error);
            return res.status(500).json({ message: 'Error al recuperar el rol' });
        }
    },

    // 3. Crear un nuevo rol
    create: async (req, res) => {
        try {
            const { nombre, descripcion } = req.body;

            // Verificar si el nombre ya existe (case insensitive)
            const existingRol = await Rol.findOne({ where: { nombre } });
            if (existingRol) {
                return res.status(400).json({ message: 'El nombre de rol ya existe' });
            }

            const nuevoRol = await Rol.create({ nombre, descripcion });

            return res.status(201).json({
                message: 'Rol creado exitosamente',
                rol: nuevoRol
            });
        } catch (error) {
            console.error('Error en createRol:', error);
            return res.status(500).json({ message: 'Error al crear el rol' });
        }
    },

    // 4. Actualizar rol
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, descripcion } = req.body;

            const rol = await Rol.findByPk(id);
            if (!rol) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            await rol.update({
                nombre: nombre || rol.nombre,
                descripcion: descripcion || rol.descripcion
            });

            return res.status(200).json({
                message: 'Rol actualizado correctamente',
                rol
            });
        } catch (error) {
            console.error('Error en updateRol:', error);
            return res.status(500).json({ message: 'Error al actualizar el rol' });
        }
    },

    // 5. Eliminar rol
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar si hay usuarios vinculados antes de borrar
            const usuariosVinculados = await Usuario.count({ where: { rol_id: id } });
            if (usuariosVinculados > 0) {
                return res.status(400).json({ 
                    message: `No se puede eliminar el rol porque tiene ${usuariosVinculados} usuarios asociados.` 
                });
            }

            const rol = await Rol.findByPk(id);
            if (!rol) {
                return res.status(404).json({ message: 'Rol no encontrado' });
            }

            await rol.destroy();
            return res.status(200).json({ message: 'Rol eliminado correctamente' });
        } catch (error) {
            console.error('Error en deleteRol:', error);
            return res.status(500).json({ message: 'Error al eliminar el rol' });
        }
    }
};

module.exports = rolController;

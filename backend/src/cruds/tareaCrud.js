const { TareaDisponible } = require('../models');

/**
 * Controller para la gestión de Tareas Disponibles (Catálogo de actividades)
 */
const tareaController = {
    // 1. Listar todas las tareas (opción de filtrar solo activas)
    getAll: async (req, res) => {
        try {
            const { soloActivas } = req.query;
            const whereClause = soloActivas === 'true' ? { activa: 1 } : {};

            const tareas = await TareaDisponible.findAll({
                where: whereClause,
                order: [['created_at', 'DESC']]
            });
            return res.status(200).json(tareas);
        } catch (error) {
            console.error('Error en getAllTareas:', error);
            return res.status(500).json({ message: 'Error al recuperar el catálogo de tareas' });
        }
    },

    // 2. Obtener una tarea por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const tarea = await TareaDisponible.findByPk(id);

            if (!tarea) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }

            return res.status(200).json(tarea);
        } catch (error) {
            console.error('Error en getTareaById:', error);
            return res.status(500).json({ message: 'Error al recuperar los detalles de la tarea' });
        }
    },

    // 3. Crear una nueva tarea
    create: async (req, res) => {
        try {
            const { titulo, descripcion, horas, dias, activa } = req.body;

            const nuevaTarea = await TareaDisponible.create({
                titulo,
                descripcion,
                horas,
                dias,
                activa: activa !== undefined ? activa : 1
            });

            return res.status(201).json({
                message: 'Tarea creada exitosamente',
                tarea: nuevaTarea
            });
        } catch (error) {
            console.error('Error en createTarea:', error);
            return res.status(500).json({ message: 'Error al crear la tarea' });
        }
    },

    // 4. Actualizar tarea
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { titulo, descripcion, horas, dias, activa } = req.body;

            const tarea = await TareaDisponible.findByPk(id);
            if (!tarea) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }

            await tarea.update({
                titulo: titulo || tarea.titulo,
                descripcion: descripcion || tarea.descripcion,
                horas: horas || tarea.horas,
                dias: dias || tarea.dias,
                activa: activa !== undefined ? activa : tarea.activa
            });

            return res.status(200).json({
                message: 'Tarea actualizada correctamente',
                tarea
            });
        } catch (error) {
            console.error('Error en updateTarea:', error);
            return res.status(500).json({ message: 'Error al actualizar la tarea' });
        }
    },

    // 5. Eliminar tarea
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const tarea = await TareaDisponible.findByPk(id);

            if (!tarea) {
                return res.status(404).json({ message: 'Tarea no encontrada' });
            }

            // Aquí podríamos verificar si tiene reportes antes de borrar
            await tarea.destroy();
            return res.status(200).json({ message: 'Tarea eliminada del catálogo' });
        } catch (error) {
            console.error('Error en deleteTarea:', error);
            return res.status(500).json({ message: 'Error al eliminar la tarea' });
        }
    }
};

module.exports = tareaController;

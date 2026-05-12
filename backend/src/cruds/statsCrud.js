const { StatsTipo, TareaDisponible } = require('../models');

/**
 * Controller para la gestión de Estadísticas por Tipo de Tarea
 */
const statsController = {
    // 1. Listar todas las estadísticas
    getAll: async (req, res) => {
        try {
            const stats = await StatsTipo.findAll({
                include: [{ model: TareaDisponible, attributes: ['titulo'] }],
                order: [['periodo', 'DESC']]
            });
            return res.status(200).json(stats);
        } catch (error) {
            console.error('Error en getAllStats:', error);
            return res.status(500).json({ message: 'Error al recuperar las estadísticas' });
        }
    },

    // 2. Obtener estadística por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const stat = await StatsTipo.findByPk(id, {
                include: [{ model: TareaDisponible, attributes: ['titulo', 'descripcion'] }]
            });

            if (!stat) {
                return res.status(404).json({ message: 'Estadística no encontrada' });
            }

            return res.status(200).json(stat);
        } catch (error) {
            console.error('Error en getStatById:', error);
            return res.status(500).json({ message: 'Error al recuperar la estadística' });
        }
    },

    // 3. Crear nuevo registro de estadística
    create: async (req, res) => {
        try {
            const { 
                tarea_id, periodo, total_reportes, 
                total_horas, total_aprobados, total_rechazados 
            } = req.body;

            const nuevaStat = await StatsTipo.create({
                tarea_id,
                periodo,
                total_reportes: total_reportes || 0,
                total_horas: total_horas || 0,
                total_aprobados: total_aprobados || 0,
                total_rechazados: total_rechazados || 0
            });

            return res.status(201).json({
                message: 'Estadística registrada correctamente',
                stat: nuevaStat
            });
        } catch (error) {
            console.error('Error en createStat:', error);
            return res.status(500).json({ message: 'Error al registrar la estadística' });
        }
    },

    // 4. Actualizar estadística
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const stat = await StatsTipo.findByPk(id);
            if (!stat) {
                return res.status(404).json({ message: 'Estadística no encontrada' });
            }

            await stat.update(updateData);

            return res.status(200).json({
                message: 'Estadística actualizada correctamente',
                stat
            });
        } catch (error) {
            console.error('Error en updateStat:', error);
            return res.status(500).json({ message: 'Error al actualizar la estadística' });
        }
    },

    // 5. Eliminar estadística
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const stat = await StatsTipo.findByPk(id);

            if (!stat) {
                return res.status(404).json({ message: 'Estadística no encontrada' });
            }

            await stat.destroy();
            return res.status(200).json({ message: 'Registro de estadística eliminado' });
        } catch (error) {
            console.error('Error en deleteStat:', error);
            return res.status(500).json({ message: 'Error al eliminar la estadística' });
        }
    }
};

module.exports = statsController;

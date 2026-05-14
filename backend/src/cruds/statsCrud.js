const { StatsTipo } = require('../models');

const statsController = {
    getAll: async (req, res) => {
        try {
            const stats = await StatsTipo.findAll({ order: [['tipo', 'ASC']] });
            return res.status(200).json(stats);
        } catch (error) {
            console.error('Error en getAllStats:', error);
            return res.status(500).json({ message: 'Error al recuperar las estadísticas' });
        }
    },

    getById: async (req, res) => {
        try {
            const stat = await StatsTipo.findByPk(req.params.id);
            if (!stat) return res.status(404).json({ message: 'Estadística no encontrada' });
            return res.status(200).json(stat);
        } catch (error) {
            console.error('Error en getStatById:', error);
            return res.status(500).json({ message: 'Error al recuperar la estadística' });
        }
    },

    create: async (req, res) => {
        try {
            const { tipo, planificados, muertos } = req.body;
            if (!tipo) return res.status(400).json({ message: 'El tipo es requerido' });

            const nuevaStat = await StatsTipo.create({
                tipo: tipo.toLowerCase().trim(),
                planificados: planificados || 0,
                muertos: muertos || 0
            });

            return res.status(201).json({ message: 'Estadística creada', stat: nuevaStat });
        } catch (error) {
            console.error('Error en createStat:', error);
            return res.status(500).json({ message: 'Error al crear la estadística' });
        }
    },

    update: async (req, res) => {
        try {
            const stat = await StatsTipo.findByPk(req.params.id);
            if (!stat) return res.status(404).json({ message: 'Estadística no encontrada' });

            const { planificados, muertos, tipo } = req.body;
            await stat.update({
                tipo: tipo !== undefined ? tipo.toLowerCase().trim() : stat.tipo,
                planificados: planificados !== undefined ? parseInt(planificados) || 0 : stat.planificados,
                muertos: muertos !== undefined ? parseInt(muertos) || 0 : stat.muertos
            });

            return res.status(200).json({ message: 'Estadística actualizada', stat });
        } catch (error) {
            console.error('Error en updateStat:', error);
            return res.status(500).json({ message: 'Error al actualizar la estadística' });
        }
    },

    delete: async (req, res) => {
        try {
            const stat = await StatsTipo.findByPk(req.params.id);
            if (!stat) return res.status(404).json({ message: 'Estadística no encontrada' });
            await stat.destroy();
            return res.status(200).json({ message: 'Estadística eliminada' });
        } catch (error) {
            console.error('Error en deleteStat:', error);
            return res.status(500).json({ message: 'Error al eliminar la estadística' });
        }
    }
};

module.exports = statsController;

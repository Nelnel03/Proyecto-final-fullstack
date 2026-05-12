const { Reporte, Usuario, Rol } = require('../models');

/**
 * Controller para la gestión de Reportes Generales
 */
const reporteController = {
    // 1. Listar todos los reportes (con información de quién reporta)
    getAll: async (req, res) => {
        try {
            const reportes = await Reporte.findAll({
                include: [
                    { model: Usuario, attributes: ['nombre', 'email'] },
                    { model: Rol, attributes: ['nombre'] }
                ],
                order: [['created_at', 'DESC']]
            });
            return res.status(200).json(reportes);
        } catch (error) {
            console.error('Error en getAllReportes:', error);
            return res.status(500).json({ message: 'Error al recuperar los reportes' });
        }
    },

    // 2. Obtener un reporte específico
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const reporte = await Reporte.findByPk(id, {
                include: [
                    { model: Usuario, attributes: ['nombre', 'email'] },
                    { model: Rol, attributes: ['nombre'] }
                ]
            });

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            return res.status(200).json(reporte);
        } catch (error) {
            console.error('Error en getReporteById:', error);
            return res.status(500).json({ message: 'Error al recuperar el reporte' });
        }
    },

    // 3. Crear un nuevo reporte
    create: async (req, res) => {
        try {
            const { usuario_id, rol_id, tipo, asunto, contenido } = req.body;

            const nuevoReporte = await Reporte.create({
                usuario_id,
                rol_id,
                tipo,
                asunto,
                contenido,
                fecha: new Date(),
                visto: 0
            });

            return res.status(201).json({
                message: 'Reporte enviado exitosamente',
                reporte: nuevoReporte
            });
        } catch (error) {
            console.error('Error en createReporte:', error);
            return res.status(500).json({ message: 'Error al enviar el reporte' });
        }
    },

    // 4. Marcar como visto o actualizar
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { visto, tipo, asunto, contenido } = req.body;

            const reporte = await Reporte.findByPk(id);
            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            await reporte.update({
                visto: visto !== undefined ? visto : reporte.visto,
                tipo: tipo || reporte.tipo,
                asunto: asunto || reporte.asunto,
                contenido: contenido || reporte.contenido
            });

            return res.status(200).json({
                message: 'Reporte actualizado correctamente',
                reporte
            });
        } catch (error) {
            console.error('Error en updateReporte:', error);
            return res.status(500).json({ message: 'Error al actualizar el reporte' });
        }
    },

    // 5. Eliminar reporte
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const reporte = await Reporte.findByPk(id);

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            await reporte.destroy();
            return res.status(200).json({ message: 'Reporte eliminado correctamente' });
        } catch (error) {
            console.error('Error en deleteReporte:', error);
            return res.status(500).json({ message: 'Error al eliminar el reporte' });
        }
    }
};

module.exports = reporteController;

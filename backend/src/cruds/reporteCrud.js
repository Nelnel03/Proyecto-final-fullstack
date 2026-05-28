const { Reporte, Usuario, Rol } = require('../models');
const socketService = require('../services/socketService');

const reporteController = {
    getAll: async (req, res) => {
        try {
            const condition = {};
            // Non-admin users only see their own reports
            if (req.user.rol !== 'admin') {
                condition.usuario_id = req.user.id;
            } else {
                if (req.query.tipo) condition.tipo = req.query.tipo;
            }

            const reportes = await Reporte.findAll({
                where: condition,
                include: [
                    { model: Usuario, attributes: ['nombre', 'email'], required: false },
                    { model: Rol, attributes: ['nombre'], required: false }
                ],
                order: [['created_at', 'DESC']]
            });
            return res.status(200).json(reportes);
        } catch (error) {
            console.error('Error en getAllReportes:', error);
            return res.status(500).json({ message: 'Error al recuperar los reportes' });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const reporte = await Reporte.findByPk(id, {
                include: [
                    { model: Usuario, attributes: ['nombre', 'email'], required: false },
                    { model: Rol, attributes: ['nombre'], required: false }
                ]
            });

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            if (req.user.rol !== 'admin' && reporte.usuario_id !== req.user.id) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }

            return res.status(200).json(reporte);
        } catch (error) {
            console.error('Error en getReporteById:', error);
            return res.status(500).json({ message: 'Error al recuperar el reporte' });
        }
    },

    create: async (req, res) => {
        try {
            const body = req.body;

            // Usuario from JWT (fallback if not provided)
            const usuario_id = body.usuario_id || body.userId || req.user.id;
            const rol_id = body.rol_id || req.user.rol_id || 4;

            // Map flexible field names to model fields
            // Support reports: asunto + mensaje/contenido
            // Robo reports: tipo_arbol → asunto, descripcion → contenido, ubicacion included in contenido
            let asunto = body.asunto || body.tipo_arbol || 'Sin asunto';
            let contenido = body.contenido || body.mensaje || body.descripcion || 'Sin contenido';

            // For robo reports: include ubicacion in contenido
            if (body.ubicacion && !body.contenido && !body.mensaje) {
                contenido = `Ubicación: ${body.ubicacion}\n\n${contenido}`;
            }

            const nuevoReporte = await Reporte.create({
                usuario_id,
                rol_id,
                tipo: body.tipo || null,
                asunto,
                contenido,
                estado: body.estado || 'Pendiente',
                fecha: new Date(),
                visto: 0
            });

            socketService.notifyNotificationUpdate();

            return res.status(201).json({
                message: 'Reporte enviado exitosamente',
                reporte: nuevoReporte
            });
        } catch (error) {
            console.error('Error en createReporte:', error);
            return res.status(500).json({ message: 'Error al enviar el reporte' });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { visto, tipo, asunto, contenido, estado } = req.body;

            const reporte = await Reporte.findByPk(id);
            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            await reporte.update({
                visto: visto !== undefined ? (visto ? 1 : 0) : reporte.visto,
                tipo: tipo !== undefined ? tipo : reporte.tipo,
                asunto: asunto || reporte.asunto,
                contenido: contenido || reporte.contenido,
                estado: estado !== undefined ? estado : reporte.estado
            });

            socketService.notifyNotificationUpdate();

            return res.status(200).json({
                message: 'Reporte actualizado correctamente',
                reporte
            });
        } catch (error) {
            console.error('Error en updateReporte:', error);
            return res.status(500).json({ message: 'Error al actualizar el reporte' });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const reporte = await Reporte.findByPk(id);

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            await reporte.destroy();
            
            socketService.notifyNotificationUpdate();

            return res.status(200).json({ message: 'Reporte eliminado correctamente' });
        } catch (error) {
            console.error('Error en deleteReporte:', error);
            return res.status(500).json({ message: 'Error al eliminar el reporte' });
        }
    }
};

module.exports = reporteController;

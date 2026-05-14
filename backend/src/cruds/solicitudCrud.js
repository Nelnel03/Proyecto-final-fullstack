const { SolicitudVoluntariado, Usuario } = require('../models');

/**
 * Controller para la gestión de Solicitudes de Voluntariado
 */
const solicitudController = {
    // 1. Listar solicitudes (admin ve todas; usuarios ven las suyas)
    getAll: async (req, res) => {
        try {
            const condition = {};
            if (req.user.rol !== 'admin') {
                condition.usuario_id = req.user.id;
            }
            const solicitudes = await SolicitudVoluntariado.findAll({
                where: condition,
                include: [{ model: Usuario, attributes: ['nombre', 'email', 'telefono'] }],
                order: [['created_at', 'DESC']]
            });
            return res.status(200).json(solicitudes);
        } catch (error) {
            console.error('Error en getAllSolicitudes:', error);
            return res.status(500).json({ message: 'Error al recuperar las solicitudes' });
        }
    },

    // 2. Obtener una solicitud por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const solicitud = await SolicitudVoluntariado.findByPk(id, {
                include: [{ model: Usuario, attributes: ['nombre', 'email', 'telefono', 'area'] }]
            });

            if (!solicitud) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }

            return res.status(200).json(solicitud);
        } catch (error) {
            console.error('Error en getSolicitudById:', error);
            return res.status(500).json({ message: 'Error al recuperar la solicitud' });
        }
    },

    // 3. Crear una nueva solicitud
    create: async (req, res) => {
        try {
            // Accept both userId (camelCase from frontend) and usuario_id (snake_case)
            const usuario_id = req.body.usuario_id || req.body.userId || req.user.id;
            const { mensaje } = req.body;

            if (!usuario_id) {
                return res.status(400).json({ message: 'ID de usuario requerido' });
            }

            // Verificar si ya tiene una solicitud pendiente
            const existingRequest = await SolicitudVoluntariado.findOne({
                where: { usuario_id, estado: 'pendiente' }
            });

            if (existingRequest) {
                return res.status(400).json({ message: 'Ya tienes una solicitud pendiente de revisión' });
            }

            const nuevaSolicitud = await SolicitudVoluntariado.create({
                usuario_id,
                mensaje,
                fecha: new Date(),
                estado: 'pendiente'
            });

            return res.status(201).json({
                message: 'Solicitud enviada correctamente',
                solicitud: nuevaSolicitud
            });
        } catch (error) {
            console.error('Error en createSolicitud:', error);
            return res.status(500).json({ message: 'Error al procesar la solicitud' });
        }
    },

    // 4. Actualizar estado de la solicitud
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado, visto } = req.body;

            const solicitud = await SolicitudVoluntariado.findByPk(id);
            if (!solicitud) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }

            // Normalize estado to lowercase for ENUM compatibility
            const estadoNorm = estado ? estado.toLowerCase() : undefined;
            const updateData = {};
            if (estadoNorm) updateData.estado = estadoNorm;
            if (visto !== undefined) updateData.visto = visto ? 1 : 0;

            await solicitud.update(updateData);

            return res.status(200).json({
                message: `Solicitud actualizada`,
                solicitud
            });
        } catch (error) {
            console.error('Error en updateSolicitud:', error);
            return res.status(500).json({ message: 'Error al actualizar el estado' });
        }
    },

    // 5. Eliminar solicitud
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const solicitud = await SolicitudVoluntariado.findByPk(id);

            if (!solicitud) {
                return res.status(404).json({ message: 'Solicitud no encontrada' });
            }

            await solicitud.destroy();
            return res.status(200).json({ message: 'Solicitud eliminada' });
        } catch (error) {
            console.error('Error en deleteSolicitud:', error);
            return res.status(500).json({ message: 'Error al eliminar la solicitud' });
        }
    }
};

module.exports = solicitudController;

const { ReporteVoluntariado, Usuario, TareaDisponible } = require('../models');
const { Op } = require('sequelize');

const reporteVoluntariadoCrud = {
    getAll: async (req, res) => {
        try {
            const condition = {};
            // Voluntarios only see their own reports
            if (req.user.rol === 'voluntario') {
                condition.voluntario_id = req.user.id;
            } else {
                if (req.query.estado) condition.estado = req.query.estado;
                if (req.query.voluntario_id) condition.voluntario_id = req.query.voluntario_id;
            }

            const reportes = await ReporteVoluntariado.findAll({
                where: condition,
                include: [
                    { model: Usuario, attributes: ['nombre', 'email', 'area'], required: false },
                    { model: TareaDisponible, attributes: ['titulo'], required: false }
                ],
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json(reportes);
        } catch (error) {
            console.error('Error en getAllReportesVoluntariado:', error);
            return res.status(500).json({ message: 'Error al recuperar los reportes de voluntariado' });
        }
    },

    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const reporte = await ReporteVoluntariado.findByPk(id, {
                include: [
                    { model: Usuario, attributes: ['nombre', 'email', 'telefono', 'area'], required: false },
                    { model: TareaDisponible, attributes: ['titulo', 'descripcion'], required: false }
                ]
            });

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte de voluntariado no encontrado' });
            }

            if (req.user.rol === 'voluntario' && reporte.voluntario_id !== req.user.id) {
                return res.status(403).json({ message: 'Acceso denegado' });
            }

            return res.status(200).json(reporte);
        } catch (error) {
            console.error('Error en getReporteVoluntariadoById:', error);
            return res.status(500).json({ message: 'Error al recuperar el reporte' });
        }
    },

    create: async (req, res) => {
        try {
            const body = req.body;

            // Accept both camelCase (frontend) and snake_case
            const voluntario_id = body.voluntario_id || body.voluntarioId || req.user.id || null;
            const tarea_id = body.tarea_id || body.tareaId || null;

            // Normalize estado to valid ENUM values
            const estadoMap = { solicitado: 'solicitado', enviado: 'enviado', pendiente: 'pendiente', aprobado: 'aprobado', rechazado: 'rechazado', asignado: 'asignado', en_curso: 'en_curso', rechazado_pre: 'rechazado_pre' };
            const estado = estadoMap[body.estado] || 'pendiente';

            // Normalize fecha
            let fecha = body.fecha;
            if (!fecha || fecha === '-' || fecha === '') fecha = null;

            const nuevoReporte = await ReporteVoluntariado.create({
                voluntario_id,
                tarea_id,
                voluntarioNombre: body.voluntarioNombre || null,
                voluntarioEmail: body.voluntarioEmail || null,
                tipoTarea: body.tipoTarea || null,
                horaInicio: body.horaInicio || null,
                horaFin: body.horaFin || null,
                horas: body.horas || null,
                tareas: body.tareas || null,
                pruebas: body.pruebas || null,
                fecha,
                timestamp: body.timestamp || null,
                estado,
                visto: 0
            });

            return res.status(201).json({
                message: 'Reporte de actividad enviado correctamente',
                reporte: nuevoReporte
            });
        } catch (error) {
            console.error('Error en createReporteVoluntariado:', error);
            return res.status(500).json({ message: 'Error al crear el reporte de actividad' });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado, motivoRechazo, visto, horas, tareas, pruebas, fecha } = req.body;

            const reporte = await ReporteVoluntariado.findByPk(id);
            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            const validEstados = ['pendiente', 'aprobado', 'rechazado', 'solicitado', 'enviado', 'asignado', 'en_curso', 'rechazado_pre'];
            await reporte.update({
                estado: (estado && validEstados.includes(estado)) ? estado : reporte.estado,
                motivoRechazo: motivoRechazo !== undefined ? motivoRechazo : reporte.motivoRechazo,
                visto: visto !== undefined ? visto : reporte.visto,
                horas: horas !== undefined ? horas : reporte.horas,
                tareas: tareas !== undefined ? tareas : reporte.tareas,
                pruebas: pruebas !== undefined ? pruebas : reporte.pruebas,
                fecha: fecha !== undefined ? fecha : reporte.fecha
            });

            return res.status(200).json({
                message: 'Reporte actualizado correctamente',
                reporte
            });
        } catch (error) {
            console.error('Error en updateReporteVoluntariado:', error);
            return res.status(500).json({ message: 'Error al actualizar el reporte' });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const reporte = await ReporteVoluntariado.findByPk(id);

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            await reporte.destroy();
            return res.status(200).json({ message: 'Reporte de voluntariado eliminado' });
        } catch (error) {
            console.error('Error en deleteReporteVoluntariado:', error);
            return res.status(500).json({ message: 'Error al eliminar el reporte' });
        }
    }
};

module.exports = reporteVoluntariadoCrud;

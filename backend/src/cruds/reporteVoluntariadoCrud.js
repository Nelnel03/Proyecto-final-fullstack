const { ReporteVoluntariado, Usuario, TareaDisponible } = require('../models');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination');

/**
 * Controller para la gestión de Reportes de Voluntariado
 */
const reporteVoluntariadoCrud = {
    // 1. Listar todos los reportes con Paginación y Filtros
    getAll: async (req, res) => {
        try {
            const { page, size, estado, voluntario_id, tarea_id } = req.query;
            const { limit, offset } = getPagination(page, size);

            const condition = {};
            if (estado) condition.estado = estado;
            if (voluntario_id) condition.voluntario_id = voluntario_id;
            if (tarea_id) condition.tarea_id = tarea_id;

            const data = await ReporteVoluntariado.findAndCountAll({
                where: condition,
                limit,
                offset,
                include: [
                    { model: Usuario, attributes: ['nombre', 'email', 'area'] },
                    { model: TareaDisponible, attributes: ['titulo'] }
                ],
                order: [['fecha', 'DESC'], ['created_at', 'DESC']]
            });

            const response = getPagingData(data, page, limit);
            return res.status(200).json(response);
        } catch (error) {
            console.error('Error en getAllReportesVoluntariado:', error);
            return res.status(500).json({ message: 'Error al recuperar los reportes de voluntariado' });
        }
    },

    // 2. Obtener un reporte específico por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const reporte = await ReporteVoluntariado.findByPk(id, {
                include: [
                    { model: Usuario, attributes: ['nombre', 'email', 'telefono', 'area'] },
                    { model: TareaDisponible, attributes: ['titulo', 'descripcion'] }
                ]
            });

            if (!reporte) {
                return res.status(404).json({ message: 'Reporte de voluntariado no encontrado' });
            }

            return res.status(200).json(reporte);
        } catch (error) {
            console.error('Error en getReporteVoluntariadoById:', error);
            return res.status(500).json({ message: 'Error al recuperar el reporte' });
        }
    },

    // 3. Crear un nuevo reporte de actividad
    create: async (req, res) => {
        try {
            const { 
                voluntario_id, tarea_id, horaInicio, horaFin, 
                horas, tareas, pruebas, fecha 
            } = req.body;

            const nuevoReporte = await ReporteVoluntariado.create({
                voluntario_id,
                tarea_id,
                horaInicio,
                horaFin,
                horas,
                tareas,
                pruebas,
                fecha: fecha || new Date(),
                estado: 'pendiente',
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

    // 4. Actualizar estado (Aprobar/Rechazar) o información
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { estado, motivoRechazo, visto, horas, tareas } = req.body;

            const reporte = await ReporteVoluntariado.findByPk(id);
            if (!reporte) {
                return res.status(404).json({ message: 'Reporte no encontrado' });
            }

            await reporte.update({
                estado: estado || reporte.estado,
                motivoRechazo: motivoRechazo !== undefined ? motivoRechazo : reporte.motivoRechazo,
                visto: visto !== undefined ? visto : reporte.visto,
                horas: horas || reporte.horas,
                tareas: tareas || reporte.tareas
            });

            return res.status(200).json({
                message: 'Estado del reporte actualizado correctamente',
                reporte
            });
        } catch (error) {
            console.error('Error en updateReporteVoluntariado:', error);
            return res.status(500).json({ message: 'Error al actualizar el reporte' });
        }
    },

    // 5. Eliminar reporte
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

module.exports = reporteVoluntariadoController;

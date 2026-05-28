const { sequelize } = require('../models');
const socketService = require('../services/socketService');

/**
 * Calcula el resumen de notificaciones no leídas (visto=0) en todas las tablas.
 * Query ligero: solo COUNTs, sin traer filas completas.
 */
async function calcularSummary() {
    const [[soporte]] = await sequelize.query(
        "SELECT COUNT(*) AS total FROM reportes WHERE visto = 0 AND (tipo IS NULL OR tipo != 'robo')"
    );
    const [[robos]] = await sequelize.query(
        "SELECT COUNT(*) AS total FROM reportes WHERE visto = 0 AND tipo = 'robo'"
    );
    const [[solicitudes]] = await sequelize.query(
        "SELECT COUNT(*) AS total FROM solicitudes_voluntariado WHERE visto = 0"
    );
    const [[labores]] = await sequelize.query(
        "SELECT COUNT(*) AS total FROM reportes_voluntariado WHERE visto = 0"
    );

    const s = Number(soporte.total);
    const r = Number(robos.total);
    const sol = Number(solicitudes.total);
    const l = Number(labores.total);

    return {
        soporte: s,
        robos: r,
        solicitudes: sol,
        labores: l,
        total: s + r + sol + l
    };
}

const notificacionController = {
    /**
     * GET /api/notificaciones/summary
     * Devuelve { total, soporte, robos, solicitudes, labores }
     */
    getSummary: async (req, res) => {
        try {
            const summary = await calcularSummary();
            return res.status(200).json(summary);
        } catch (error) {
            console.error('Error en getSummary:', error);
            return res.status(500).json({ message: 'Error al obtener resumen de notificaciones' });
        }
    },

    /**
     * PATCH /api/notificaciones/mark-read
     * Body: { ids: { reportes: [1,2], robos: [3], solicitudes: [4], labores: [5] } }
     * Marca como leídos los registros indicados por tabla. Emite socket si hubo cambios.
     */
    markRead: async (req, res) => {
        try {
            const { ids = {} } = req.body;
            const {
                reportes: idsReportes = [],
                robos: idsRobos = [],
                solicitudes: idsSolicitudes = [],
                labores: idsLabores = []
            } = ids;

            let totalAffected = 0;

            if (idsReportes.length > 0) {
                const [, meta] = await sequelize.query(
                    'UPDATE reportes SET visto = 1 WHERE id IN (:ids) AND visto = 0',
                    { replacements: { ids: idsReportes } }
                );
                totalAffected += (meta?.affectedRows ?? 0);
            }

            if (idsRobos.length > 0) {
                const [, meta] = await sequelize.query(
                    'UPDATE reportes SET visto = 1 WHERE id IN (:ids) AND visto = 0',
                    { replacements: { ids: idsRobos } }
                );
                totalAffected += (meta?.affectedRows ?? 0);
            }

            if (idsSolicitudes.length > 0) {
                const [, meta] = await sequelize.query(
                    'UPDATE solicitudes_voluntariado SET visto = 1 WHERE id IN (:ids) AND visto = 0',
                    { replacements: { ids: idsSolicitudes } }
                );
                totalAffected += (meta?.affectedRows ?? 0);
            }

            if (idsLabores.length > 0) {
                const [, meta] = await sequelize.query(
                    'UPDATE reportes_voluntariado SET visto = 1 WHERE id IN (:ids) AND visto = 0',
                    { replacements: { ids: idsLabores } }
                );
                totalAffected += (meta?.affectedRows ?? 0);
            }

            // Solo emitir socket si realmente se modificó algo (evitar loops)
            if (totalAffected > 0) {
                const summary = await calcularSummary();
                socketService.notifyNotificationUpdate(summary);
            }

            const summary = await calcularSummary();
            return res.status(200).json({ message: 'Marcadas como leídas', affected: totalAffected, summary });
        } catch (error) {
            console.error('Error en markRead:', error);
            return res.status(500).json({ message: 'Error al marcar como leídas' });
        }
    },

    /**
     * PATCH /api/notificaciones/mark-all-read
     * Marca TODOS los visto=0 como visto=1 en todas las tablas (bulk update atómico).
     */
    markAllRead: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const [, m1] = await sequelize.query(
                'UPDATE reportes SET visto = 1 WHERE visto = 0',
                { transaction: t }
            );
            const [, m2] = await sequelize.query(
                'UPDATE solicitudes_voluntariado SET visto = 1 WHERE visto = 0',
                { transaction: t }
            );
            const [, m3] = await sequelize.query(
                'UPDATE reportes_voluntariado SET visto = 1 WHERE visto = 0',
                { transaction: t }
            );

            await t.commit();

            const totalAffected = (m1?.affectedRows ?? 0) + (m2?.affectedRows ?? 0) + (m3?.affectedRows ?? 0);

            if (totalAffected > 0) {
                const summary = { total: 0, soporte: 0, robos: 0, solicitudes: 0, labores: 0 };
                socketService.notifyNotificationUpdate(summary);
            }

            return res.status(200).json({
                message: 'Todas las notificaciones marcadas como leídas',
                affected: totalAffected,
                summary: { total: 0, soporte: 0, robos: 0, solicitudes: 0, labores: 0 }
            });
        } catch (error) {
            await t.rollback();
            console.error('Error en markAllRead:', error);
            return res.status(500).json({ message: 'Error al marcar todas como leídas' });
        }
    }
};

module.exports = { notificacionController, calcularSummary };

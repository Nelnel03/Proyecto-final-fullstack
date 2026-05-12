const { Abono, Arbol, Usuario } = require('../models');

/**
 * Controller para la gestión de Abonos (Mantenimiento de Árboles)
 */
const abonoController = {
    // 1. Listar todos los abonos registrados
    getAll: async (req, res) => {
        try {
            const abonos = await Abono.findAll({
                include: [
                    { model: Arbol, attributes: ['nombre', 'tipo'] },
                    { model: Usuario, attributes: ['nombre'] }
                ],
                order: [['fecha', 'DESC']]
            });
            return res.status(200).json(abonos);
        } catch (error) {
            console.error('Error en getAllAbonos:', error);
            return res.status(500).json({ message: 'Error al recuperar los registros de abono' });
        }
    },

    // 2. Obtener un registro por ID
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const abono = await Abono.findByPk(id, {
                include: [
                    { model: Arbol, attributes: ['nombre', 'tipo', 'clima'] },
                    { model: Usuario, attributes: ['nombre', 'area'] }
                ]
            });

            if (!abono) {
                return res.status(404).json({ message: 'Registro de abono no encontrado' });
            }

            return res.status(200).json(abono);
        } catch (error) {
            console.error('Error en getAbonoById:', error);
            return res.status(500).json({ message: 'Error al recuperar el registro' });
        }
    },

    // 3. Registrar una nueva fertilización
    create: async (req, res) => {
        try {
            const { arbol_id, voluntario_id, tipo_abono, cantidad_kg, fecha, notas } = req.body;

            const nuevoAbono = await Abono.create({
                arbol_id,
                voluntario_id,
                tipo_abono,
                cantidad_kg,
                fecha: fecha || new Date(),
                notas
            });

            return res.status(201).json({
                message: 'Registro de abono creado exitosamente',
                abono: nuevoAbono
            });
        } catch (error) {
            console.error('Error en createAbono:', error);
            return res.status(500).json({ message: 'Error al registrar el abono' });
        }
    },

    // 4. Actualizar registro
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const abono = await Abono.findByPk(id);
            if (!abono) {
                return res.status(404).json({ message: 'Registro de abono no encontrado' });
            }

            await abono.update(updateData);

            return res.status(200).json({
                message: 'Registro de abono actualizado correctamente',
                abono
            });
        } catch (error) {
            console.error('Error en updateAbono:', error);
            return res.status(500).json({ message: 'Error al actualizar el registro' });
        }
    },

    // 5. Eliminar registro
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const abono = await Abono.findByPk(id);

            if (!abono) {
                return res.status(404).json({ message: 'Registro no encontrado' });
            }

            await abono.destroy();
            return res.status(200).json({ message: 'Registro de abono eliminado' });
        } catch (error) {
            console.error('Error en deleteAbono:', error);
            return res.status(500).json({ message: 'Error al eliminar el registro' });
        }
    }
};

module.exports = abonoController;

const { Abono, Arbol, Usuario, sequelize } = require('../models');

/**
 * Controller para la gestión de Abonos (Mantenimiento de Árboles)
 */
const abonoController = {
    // 1. Listar todos los abonos registrados
    getAll: async (req, res) => {
        try {
            const abonos = await Abono.findAll({
                include: [
                    { model: Arbol, attributes: ['nombre', 'tipo'], required: false },
                    { model: Usuario, attributes: ['nombre'], required: false }
                ],
                order: [['created_at', 'DESC']]
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
                    { model: Arbol, attributes: ['nombre', 'tipo', 'clima'], required: false },
                    { model: Usuario, attributes: ['nombre', 'area'], required: false }
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

    // 3. Registrar un abono / producto de inventario
    create: async (req, res) => {
        const t = await sequelize.transaction();
        try {
            const {
                arbol_id, voluntario_id,
                nombre, stock, unidad, imagenUrl,
                tipo_abono, cantidad_kg,
                fecha, notas, nuevo_progreso
            } = req.body;

            const nuevoAbono = await Abono.create({
                arbol_id: arbol_id || null,
                voluntario_id: voluntario_id || null,
                nombre: nombre || null,
                stock: stock !== undefined ? stock : null,
                unidad: unidad || null,
                imagenUrl: imagenUrl || null,
                tipo_abono: tipo_abono || null,
                cantidad_kg: cantidad_kg || null,
                fecha: fecha || null,
                notas: notas || null
            }, { transaction: t });

            if (nuevo_progreso !== undefined && arbol_id) {
                const arbol = await Arbol.findByPk(arbol_id);
                if (arbol) {
                    await arbol.update({ progreso: nuevo_progreso }, { transaction: t });
                }
            }

            await t.commit();

            return res.status(201).json({
                message: 'Registro creado correctamente',
                abono: nuevoAbono
            });
        } catch (error) {
            await t.rollback();
            console.error('Error en createAbono:', error);
            return res.status(500).json({ message: 'Error al registrar el abono.' });
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

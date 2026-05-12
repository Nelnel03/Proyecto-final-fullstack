const { Arbol, Abono } = require('../models');

/**
 * Controller para la gestión de Árboles (Inventario Forestal)
 * Enfoque: Trazabilidad y gestión de estados.
 */
const arbolController = {
    // 1. Listar todos los árboles
    getAll: async (req, res) => {
        try {
            const arboles = await Arbol.findAll({
                include: [{ model: Abono, limit: 5, order: [['fecha', 'DESC']] }] // Ver últimos abonos
            });
            return res.status(200).json(arboles);
        } catch (error) {
            console.error('Error en getAllTrees:', error);
            return res.status(500).json({ message: 'Error al recuperar el inventario de árboles' });
        }
    },

    // 2. Obtener detalle de un árbol
    getById: async (req, res) => {
        try {
            const { id } = req.params;
            const arbol = await Arbol.findByPk(id, {
                include: [{ model: Abono }]
            });

            if (!arbol) {
                return res.status(404).json({ message: 'Árbol no encontrado' });
            }

            return res.status(200).json(arbol);
        } catch (error) {
            console.error('Error en getTreeById:', error);
            return res.status(500).json({ message: 'Error al recuperar los detalles del árbol' });
        }
    },

    // 3. Registrar un nuevo árbol
    create: async (req, res) => {
        try {
            const { 
                nombre, nombreCientifico, tipo, progreso, familia, 
                altura_min_m, altura_max_m, clima, descripcion, imagenUrl 
            } = req.body;

            const nuevoArbol = await Arbol.create({
                nombre,
                nombreCientifico,
                tipo,
                progreso: progreso || 0,
                familia,
                altura_min_m,
                altura_max_m,
                clima,
                descripcion,
                imagenUrl,
                fechaRegistro: new Date()
            });

            return res.status(201).json({
                message: 'Árbol registrado exitosamente',
                arbol: nuevoArbol
            });
        } catch (error) {
            console.error('Error en createTree:', error);
            return res.status(500).json({ message: 'Error al registrar el árbol' });
        }
    },

    // 4. Actualizar información o progreso
    update: async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const arbol = await Arbol.findByPk(id);
            if (!arbol) {
                return res.status(404).json({ message: 'Árbol no encontrado' });
            }

            await arbol.update(updateData);

            return res.status(200).json({
                message: 'Información del árbol actualizada correctamente',
                arbol
            });
        } catch (error) {
            console.error('Error en updateTree:', error);
            return res.status(500).json({ message: 'Error al actualizar el árbol' });
        }
    },

    // 5. Eliminar un registro
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const arbol = await Arbol.findByPk(id);

            if (!arbol) {
                return res.status(404).json({ message: 'Árbol no encontrado' });
            }

            await arbol.destroy();
            return res.status(200).json({ message: 'Registro de árbol eliminado correctamente' });
        } catch (error) {
            console.error('Error en deleteTree:', error);
            return res.status(500).json({ message: 'Error al eliminar el árbol' });
        }
    }
};

module.exports = arbolController;

const { Arbol, Abono } = require('../models');
const { Op } = require('sequelize');
const { getPagination, getPagingData } = require('../utils/pagination');

/**
 * Controller para la gestión de Árboles (Inventario Forestal)
 * Enfoque: Trazabilidad y gestión de estados.
 */
const arbolController = {
    // 1. Listar todos los árboles con Paginación y Filtros
    getAll: async (req, res) => {
        try {
            const { page, size, nombre, tipo, estado } = req.query;
            const { limit, offset } = getPagination(page, size);

            // Construcción dinámica de filtros
            const condition = {};
            if (nombre) condition.nombre = { [Op.like]: `%${nombre}%` };
            if (tipo) condition.tipo = tipo;
            if (estado) condition.estado = estado;

            const data = await Arbol.findAndCountAll({
                where: condition,
                limit,
                offset,
                include: [{ model: Abono, required: false }],
                order: [['fechaRegistro', 'DESC']]
            });

            const response = getPagingData(data, page, limit);
            return res.status(200).json(response);
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
                altura, crecimiento, cuidados,
                altura_min_m, altura_max_m, clima, descripcion, imagenUrl,
                estado, fechaRegistro
            } = req.body;

            const nuevoArbol = await Arbol.create({
                nombre,
                nombreCientifico,
                tipo,
                progreso: progreso || 0,
                familia,
                altura: altura || null,
                crecimiento: crecimiento || null,
                cuidados: cuidados || null,
                altura_min_m,
                altura_max_m,
                clima,
                descripcion,
                imagenUrl: req.file ? req.file.path : imagenUrl,
                estado: estado || 'vivo',
                fechaRegistro: fechaRegistro || new Date()
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

            const arbol = await Arbol.findByPk(id);
            if (!arbol) {
                return res.status(404).json({ message: 'Árbol no encontrado' });
            }

            const updateData = { ...req.body };
            if (req.file) {
                updateData.imagenUrl = req.file.path;
            }

            if (updateData.estado === 'muerto') {
                if (!updateData.fechaMuerto) {
                    updateData.fechaMuerto = new Date().toISOString().split('T')[0];
                }
            } else {
                updateData.fechaMuerto = null;
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

    // 5. Dar de baja (marca como muerto en lugar de eliminar físicamente)
    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const arbol = await Arbol.findByPk(id);

            if (!arbol) {
                return res.status(404).json({ message: 'Árbol no encontrado' });
            }

            await arbol.update({
                estado: 'muerto',
                fechaMuerto: new Date().toISOString().split('T')[0]
            });

            return res.status(200).json({
                message: 'Árbol dado de baja correctamente',
                arbol
            });
        } catch (error) {
            console.error('Error en darDeBajaTree:', error);
            return res.status(500).json({ message: 'Error al dar de baja el árbol' });
        }
    }
};

module.exports = arbolController;

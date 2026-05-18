const { StatsTipo, Arbol, sequelize } = require('../models');
const { Op } = require('sequelize');

const recalcularPorTipo = async (tipo) => {
    if (!tipo) return;
    const tipoNorm = tipo.toLowerCase().trim();

    const [planificados, muertos] = await Promise.all([
        Arbol.count({ where: { tipo: tipoNorm, estado: { [Op.in]: ['vivo', 'enfermo'] } } }),
        Arbol.count({ where: { tipo: tipoNorm, estado: 'muerto' } })
    ]);

    const [stat, created] = await StatsTipo.findOrCreate({
        where: { tipo: tipoNorm },
        defaults: { planificados, muertos }
    });

    if (!created) await stat.update({ planificados, muertos });
};

const recalcularTodo = async () => {
    const filas = await Arbol.findAll({
        attributes: [[sequelize.fn('DISTINCT', sequelize.col('tipo')), 'tipo']],
        where: { tipo: { [Op.not]: null } },
        raw: true
    });

    await Promise.all(filas.map(f => recalcularPorTipo(f.tipo)));
};

module.exports = { recalcularPorTipo, recalcularTodo };

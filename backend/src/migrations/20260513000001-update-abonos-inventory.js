'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('abonos');

    // Make arbol_id nullable (drop FK first if it exists)
    if (tableDescription.arbol_id) {
      await queryInterface.changeColumn('abonos', 'arbol_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'arboles', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    // Make voluntario_id nullable
    if (tableDescription.voluntario_id) {
      await queryInterface.changeColumn('abonos', 'voluntario_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'usuarios', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    // Add inventory columns if they don't exist
    if (!tableDescription.nombre) {
      await queryInterface.addColumn('abonos', 'nombre', {
        type: Sequelize.STRING(150),
        allowNull: true
      });
    }
    if (!tableDescription.stock) {
      await queryInterface.addColumn('abonos', 'stock', {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      });
    }
    if (!tableDescription.unidad) {
      await queryInterface.addColumn('abonos', 'unidad', {
        type: Sequelize.STRING(50),
        allowNull: true
      });
    }
    if (!tableDescription.imagenUrl) {
      await queryInterface.addColumn('abonos', 'imagenUrl', {
        type: Sequelize.STRING(500),
        allowNull: true
      });
    }

    // Make fecha nullable (inventory items may not have a specific date)
    await queryInterface.changeColumn('abonos', 'fecha', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('abonos', 'nombre');
    await queryInterface.removeColumn('abonos', 'stock');
    await queryInterface.removeColumn('abonos', 'unidad');
    await queryInterface.removeColumn('abonos', 'imagenUrl');
  }
};

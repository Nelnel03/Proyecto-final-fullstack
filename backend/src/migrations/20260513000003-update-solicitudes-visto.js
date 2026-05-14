'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('solicitudes_voluntariado');
    if (!table.visto) {
      await queryInterface.addColumn('solicitudes_voluntariado', 'visto', {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      });
    }
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('solicitudes_voluntariado', 'visto');
  }
};

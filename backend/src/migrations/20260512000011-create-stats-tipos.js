'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stats_tipos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tarea_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'tareas_disponibles',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
      },
      periodo: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      total_reportes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_horas: {
        type: Sequelize.DECIMAL(8, 2),
        allowNull: false,
        defaultValue: 0
      },
      total_aprobados: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      total_rechazados: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stats_tipos');
  }
};

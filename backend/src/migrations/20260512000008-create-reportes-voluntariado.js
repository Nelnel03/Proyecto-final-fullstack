'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('reportes_voluntariado', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      voluntario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT'
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
      horaInicio: {
        type: Sequelize.TIME,
        allowNull: true
      },
      horaFin: {
        type: Sequelize.TIME,
        allowNull: true
      },
      horas: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      tareas: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      pruebas: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      fecha: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('pendiente', 'aprobado', 'rechazado'),
        allowNull: false,
        defaultValue: 'pendiente'
      },
      motivoRechazo: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      visto: {
        type: Sequelize.TINYINT,
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
    await queryInterface.dropTable('reportes_voluntariado');
  }
};

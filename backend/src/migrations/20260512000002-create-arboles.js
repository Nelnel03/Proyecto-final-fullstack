'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('arboles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      nombreCientifico: {
        type: Sequelize.STRING(150),
        allowNull: true
      },
      tipo: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      progreso: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 0
      },
      familia: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      altura_min_m: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true
      },
      altura_max_m: {
        type: Sequelize.DECIMAL(6, 2),
        allowNull: true
      },
      clima: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      imagenUrl: {
        type: Sequelize.STRING(500),
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('vivo', 'muerto', 'enfermo'),
        allowNull: false,
        defaultValue: 'vivo'
      },
      fechaRegistro: {
        type: Sequelize.DATEONLY,
        allowNull: false
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
    await queryInterface.dropTable('arboles');
  }
};

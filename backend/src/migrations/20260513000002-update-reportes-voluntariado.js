'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('reportes_voluntariado');

    // Make voluntario_id and tarea_id nullable
    if (table.voluntario_id) {
      await queryInterface.changeColumn('reportes_voluntariado', 'voluntario_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }
    if (table.tarea_id) {
      await queryInterface.changeColumn('reportes_voluntariado', 'tarea_id', {
        type: Sequelize.INTEGER,
        allowNull: true
      });
    }

    // Make fecha nullable
    if (table.fecha) {
      await queryInterface.changeColumn('reportes_voluntariado', 'fecha', {
        type: Sequelize.DATEONLY,
        allowNull: true
      });
    }

    // Extend estado ENUM
    await queryInterface.changeColumn('reportes_voluntariado', 'estado', {
      type: Sequelize.ENUM('pendiente', 'aprobado', 'rechazado', 'solicitado', 'enviado'),
      allowNull: false,
      defaultValue: 'pendiente'
    });

    // Change horaInicio and horaFin to STRING to accept 'Predefinido'
    if (table.horaInicio) {
      await queryInterface.changeColumn('reportes_voluntariado', 'horaInicio', {
        type: Sequelize.STRING(50),
        allowNull: true
      });
    }
    if (table.horaFin) {
      await queryInterface.changeColumn('reportes_voluntariado', 'horaFin', {
        type: Sequelize.STRING(50),
        allowNull: true
      });
    }

    // Add extra columns if they don't exist
    if (!table.voluntarioNombre) {
      await queryInterface.addColumn('reportes_voluntariado', 'voluntarioNombre', {
        type: Sequelize.STRING(150),
        allowNull: true
      });
    }
    if (!table.voluntarioEmail) {
      await queryInterface.addColumn('reportes_voluntariado', 'voluntarioEmail', {
        type: Sequelize.STRING(150),
        allowNull: true
      });
    }
    if (!table.tipoTarea) {
      await queryInterface.addColumn('reportes_voluntariado', 'tipoTarea', {
        type: Sequelize.STRING(200),
        allowNull: true
      });
    }
    if (!table.timestamp) {
      await queryInterface.addColumn('reportes_voluntariado', 'timestamp', {
        type: Sequelize.STRING(50),
        allowNull: true
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('reportes_voluntariado', 'voluntarioNombre');
    await queryInterface.removeColumn('reportes_voluntariado', 'voluntarioEmail');
    await queryInterface.removeColumn('reportes_voluntariado', 'tipoTarea');
    await queryInterface.removeColumn('reportes_voluntariado', 'timestamp');
  }
};

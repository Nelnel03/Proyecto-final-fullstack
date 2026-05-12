'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        nombre: 'admin',
        descripcion: 'Administrador con acceso total al sistema',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'voluntario',
        descripcion: 'Usuario voluntario que realiza tareas de reforestación',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        nombre: 'visitante',
        descripcion: 'Usuario visitante con acceso de solo lectura',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};

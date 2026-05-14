'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        nombre: 'admin',
        descripcion: 'Administrador con acceso total al sistema',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        nombre: 'voluntario',
        descripcion: 'Usuario voluntario que realiza tareas de reforestación',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        nombre: 'usuario',
        descripcion: 'Usuario registrado estándar con acceso a funciones básicas',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};

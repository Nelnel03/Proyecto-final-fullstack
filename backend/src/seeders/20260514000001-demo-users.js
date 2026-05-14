'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const password = await bcrypt.hash('password123', 10);
    
    await queryInterface.bulkInsert('usuarios', [
      {
        rol_id: 1, // Admin
        nombre: 'Administrador Sistema',
        email: 'admin@reforestacion.com',
        password: password,
        status: 'activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        rol_id: 2, // Voluntario
        nombre: 'Juan Voluntario',
        email: 'voluntario@reforestacion.com',
        password: password,
        status: 'activo',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        rol_id: 3, // Usuario
        nombre: 'Pedro Usuario',
        email: 'usuario@reforestacion.com',
        password: password,
        status: 'activo',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('usuarios', null, {});
  }
};

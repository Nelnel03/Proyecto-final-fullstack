const { sequelize } = require('../../src/models');
const mysql = require('mysql2/promise');
const config = require('../../src/config/config').test;

beforeAll(async () => {
    try {
        // 1. Crear la base de datos si no existe
        const connection = await mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password,
        });
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
        await connection.end();

        // 2. Conectar con Sequelize
        await sequelize.authenticate();
        
        // Sincronizar modelos (force: true limpia la BD para cada suite)
        await sequelize.sync({ force: true }); 
        
        // 3. Seed roles necesarios para los tests
        const { Rol } = require('../../src/models');
        await Rol.bulkCreate([
            { id: 1, nombre: 'admin', descripcion: 'Administrador del sistema' },
            { id: 2, nombre: 'voluntario', descripcion: 'Voluntario de campo' },
            { id: 3, nombre: 'user', descripcion: 'Usuario ciudadano' }
        ]);

        console.log('✅ Base de datos de prueba preparada y sembrada.');
    } catch (error) {
        console.error('❌ Error en el setup de pruebas:', error);
        process.exit(1);
    }
});

afterAll(async () => {
    if (sequelize) {
        await sequelize.close();
    }
});

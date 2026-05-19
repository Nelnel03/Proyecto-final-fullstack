require('dotenv').config();
const mysql = require('mysql2/promise');
const { sequelize, Rol } = require('../src/models');
const config = require('../src/config/config.js')['test'];

async function setupTestDatabase() {
    // 1. Conectar a MySQL (sin seleccionar base de datos) para asegurar que existe
    const conn = await mysql.createConnection({
        host: config.host || '127.0.0.1',
        user: config.username || 'root',
        password: config.password || ''
    });

    const dbName = config.database || 'reforestacion_test';
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await conn.end();

    // 2. Sincronizar modelos con force: true para limpiar tablas antiguas
    await sequelize.sync({ force: true });

    // 3. Sembrar roles iniciales requeridos para llaves foráneas y autenticación
    await Rol.bulkCreate([
        {
            id: 1,
            nombre: 'admin',
            descripcion: 'Administrador con acceso total al sistema'
        },
        {
            id: 2,
            nombre: 'voluntario',
            descripcion: 'Usuario voluntario que realiza tareas de reforestación'
        },
        {
            id: 3,
            nombre: 'usuario',
            descripcion: 'Usuario registrado estándar con acceso a funciones básicas'
        }
    ]);
}

module.exports = setupTestDatabase;

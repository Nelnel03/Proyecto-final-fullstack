require('dotenv').config();
const mysql = require('mysql2/promise');
const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

// Crea la base de datos si no existe, usando mysql2 directamente (sin Sequelize)
// así el servidor nunca muere por base de datos ausente
async function ensureDatabase() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        user: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || ''
    });
    const dbName = process.env.DB_DATABASE || 'reforestacion';
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await conn.end();
    console.log(`✅ Base de datos '${dbName}' lista.`);
}

async function startServer() {
    try {
        await ensureDatabase();

        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida correctamente.');

        if (process.env.NODE_ENV !== 'production') {
            await sequelize.sync();
            console.log('✅ Esquema de BD sincronizado.');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
}

startServer();

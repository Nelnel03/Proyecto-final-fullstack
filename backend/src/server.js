require('dotenv').config();
const mysql = require('mysql2/promise');
const http = require('http');
const app = require('./app');
const { sequelize } = require('./models');
const socketService = require('./services/socketService');

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

async function runMigrations() {
    const migrations = [
        "ALTER TABLE arboles ADD COLUMN fechaMuerto DATE NULL"
    ];
    for (const sql of migrations) {
        try {
            await sequelize.query(sql);
        } catch (e) {
            // ER_DUP_FIELDNAME = columna ya existe, se ignora
            if (e.original?.code !== 'ER_DUP_FIELDNAME') {
                console.warn('⚠️  Migración omitida:', e.original?.sqlMessage || e.message);
            }
        }
    }
    console.log('✅ Migraciones aplicadas.');
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

        await runMigrations();

        // Verificar que la API key de Groq está cargada
        if (!process.env.GROQ_API_KEY) {
            console.warn('⚠️  GROQ_API_KEY no definida en .env — el chatbot no funcionará.');
        } else {
            console.log('✅ GROQ_API_KEY cargada correctamente.');
        }

        const server = http.createServer(app);
        socketService.init(server);

        server.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error.message);
        process.exit(1);
    }
}

startServer();

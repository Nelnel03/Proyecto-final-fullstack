const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Verificar conexión con la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida correctamente.');

        // Sincronizar modelos (opcional, útil en desarrollo inicial)
        // await sequelize.sync({ force: false });

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
}

startServer();

const app = require('./app');
const { sequelize } = require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        // Verificar conexión con la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida correctamente.');

        // Sincronizar modelos con la BD (alter:true actualiza columnas sin borrar datos)
        // SOLO en development — desactivar en producción
        if (process.env.NODE_ENV !== 'production') {
            // Migrate stats_tipos from old volunteer-task schema to tree-type tracking schema
            try {
                await sequelize.query("ALTER TABLE `stats_tipos` MODIFY `tarea_id` INT NULL DEFAULT NULL");
                await sequelize.query("ALTER TABLE `stats_tipos` MODIFY `periodo` DATE NULL DEFAULT NULL");
            } catch (e) { /* Table may not exist yet or already migrated — safe to ignore */ }
            await sequelize.sync({ alter: true });
            console.log('✅ Esquema de BD sincronizado.');
        }

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error);
        process.exit(1);
    }
}

startServer();

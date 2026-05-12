const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// --- Middlewares Globales ---
app.use(helmet()); 
app.use(cors()); 
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- Rutas Base ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/arboles', require('./routes/arbolRoutes'));
app.use('/api/tareas', require('./routes/tareaRoutes'));
app.use('/api/reportes', require('./routes/reporteRoutes'));
app.use('/api/abonos', require('./routes/abonoRoutes'));
app.use('/api/reportes-voluntariado', require('./routes/reporteVoluntariadoRoutes'));
app.use('/api/solicitudes', require('./routes/solicitudRoutes'));
app.use('/api/roles', require('./routes/rolRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenido a la API de Reforestación' });
});

// --- Manejo de Errores Global ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

module.exports = app;

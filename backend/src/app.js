const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// --- Middlewares Globales ---
app.use(helmet()); 

// Configuración de CORS restringida
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173', // Vite default
    'http://localhost:3000'  // Local tests
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Permitir peticiones sin origin (como Postman o curl) o si está en la lista
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Acceso denegado por política CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); 
app.use(morgan('dev')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- Latencia artificial (SOLO en desarrollo para pruebas visuales de loaders) ---
// Activa con: DEV_LATENCY_MS=1000 en tu .env (o DEV_LATENCY_RANDOM=1 para aleatoria)
if (process.env.NODE_ENV !== 'production' && process.env.DEV_LATENCY_MS) {
    const { devLatencyMiddleware } = require('./utils/devLatency');
    app.use(devLatencyMiddleware());
    console.log(`⏱️  Dev latency activa: ${process.env.DEV_LATENCY_MS}ms ${process.env.DEV_LATENCY_RANDOM === '1' ? '(aleatoria)' : ''}`);
}

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
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'Bienvenido a la API de Reforestación',
        data: null,
        error: null,
    });
});

const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

// --- Manejo de Errores ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;

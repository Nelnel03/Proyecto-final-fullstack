/**
 * @file devLatency.js
 * @description Middleware opcional para simular latencia de red en desarrollo.
 * Facilita las pruebas visuales de los loaders y estados de carga sin necesidad
 * de conexiones lentas reales.
 *
 * USO: Agregar en app.js SOLO cuando NODE_ENV !== 'production'
 *   const { devLatencyMiddleware } = require('./utils/devLatency');
 *   if (process.env.NODE_ENV !== 'production') {
 *     app.use(devLatencyMiddleware());
 *   }
 *
 * Variables de entorno opcionales:
 *   DEV_LATENCY_MS=1000   → Latencia fija en ms (default: 600)
 *   DEV_LATENCY_RANDOM=1  → Si "1", aplica latencia aleatoria entre 200ms y DEV_LATENCY_MS
 */

/**
 * Crea el middleware de latencia artificial para desarrollo.
 * @param {Object} options
 * @param {number}  options.delay  Latencia fija en ms. Lee DEV_LATENCY_MS del .env si no se pasa.
 * @param {boolean} options.random Si true, la latencia será aleatoria entre 200ms y delay.
 * @returns {Function} Express middleware
 */
const devLatencyMiddleware = ({
    delay  = parseInt(process.env.DEV_LATENCY_MS  || '600', 10),
    random = process.env.DEV_LATENCY_RANDOM === '1',
} = {}) => {
    return (req, res, next) => {
        if (process.env.NODE_ENV === 'production') {
            return next(); // Nunca se ejecuta en producción
        }

        const ms = random
            ? Math.floor(Math.random() * (delay - 200) + 200)
            : delay;

        setTimeout(next, ms);
    };
};

module.exports = { devLatencyMiddleware };

const request = require('supertest');
const app = require('../src/app');

describe('API Root Endpoint', () => {
    it('debe retornar un mensaje de bienvenida', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('status', 'success');
        expect(res.body.message).toContain('Bienvenido a la API');
    });

    it('debe retornar 404 para rutas inexistentes', async () => {
        const res = await request(app).get('/api/ruta-que-no-existe');
        expect(res.statusCode).toEqual(404);
    });
});

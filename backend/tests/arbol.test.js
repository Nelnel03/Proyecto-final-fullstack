const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

describe('🌳 API de Árboles - Integration Tests', () => {
    let adminToken = '';
    let visitorToken = '';
    let targetArbolId = null;

    beforeAll(async () => {
        await setupTestDatabase();
        
        const adminData = await createAndLoginUser(1, 'admin_arboles@biomon.org');
        adminToken = adminData.token;

        const visitorData = await createAndLoginUser(3, 'visitor_arboles@biomon.org');
        visitorToken = visitorData.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/arboles', () => {
        it('debe registrar un nuevo árbol si tiene permisos', async () => {
            const res = await request(app)
                .post('/api/arboles')
                .set('Authorization', `Bearer ${adminToken}`)
                .field('nombre', 'Roble Sabana')
                .field('nombreCientifico', 'Tabebuia rosea')
                .field('tipo', 'Nativo')
                .field('progreso', 10)
                .field('estado', 'vivo');

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('arbol');
            expect(res.body.arbol).toHaveProperty('nombre', 'Roble Sabana');
            
            targetArbolId = res.body.arbol.id;
        });

        it('debe denegar el registro a usuarios sin rol de voluntario o admin', async () => {
            const res = await request(app)
                .post('/api/arboles')
                .set('Authorization', `Bearer ${visitorToken}`)
                .field('nombre', 'Pino')
                .field('tipo', 'Exótico');

            expect(res.statusCode).toEqual(403);
        });

        it('debe devolver error 400 si faltan campos obligatorios', async () => {
            const res = await request(app)
                .post('/api/arboles')
                .set('Authorization', `Bearer ${adminToken}`)
                .field('nombre', 'Pino'); // Falta 'tipo'

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/arboles', () => {
        it('debe listar árboles públicamente (sin token)', async () => {
            const res = await request(app).get('/api/arboles');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('items');
            expect(Array.isArray(res.body.items)).toBe(true);
            expect(res.body.items.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /api/arboles/:id', () => {
        it('debe obtener detalles de un árbol específico (público)', async () => {
            const res = await request(app).get(`/api/arboles/${targetArbolId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', targetArbolId);
            expect(res.body).toHaveProperty('nombre', 'Roble Sabana');
        });

        it('debe retornar 404 si el árbol no existe', async () => {
            const res = await request(app).get('/api/arboles/9999');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /api/arboles/:id', () => {
        it('debe permitir actualizar datos del árbol', async () => {
            const res = await request(app)
                .put(`/api/arboles/${targetArbolId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .field('nombre', 'Roble Sabana Actualizado')
                .field('tipo', 'Nativo')
                .field('progreso', 50)
                .field('estado', 'enfermo');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.arbol.progreso.toString()).toEqual('50');
            expect(res.body.arbol).toHaveProperty('estado', 'enfermo');
        });
    });

    describe('DELETE /api/arboles/:id', () => {
        it('debe eliminar el árbol si es administrador', async () => {
            const res = await request(app)
                .delete(`/api/arboles/${targetArbolId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');

            const getRes = await request(app).get(`/api/arboles/${targetArbolId}`);
            expect(getRes.statusCode).toEqual(200);
            expect(getRes.body).toHaveProperty('estado', 'muerto');
        });
    });
});

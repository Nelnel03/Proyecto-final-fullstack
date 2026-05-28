const request = require('supertest');
const app = require('../src/app');
const { sequelize, StatsTipo } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

describe('📊 API de Estadísticas (Stats) - Integration Tests', () => {
    let adminToken = '';
    let visitorToken = '';
    let targetStatId = null;

    beforeAll(async () => {
        await setupTestDatabase();
        
        const adminData = await createAndLoginUser(1, 'admin_stats@biomon.org');
        adminToken = adminData.token;

        const visitorData = await createAndLoginUser(3, 'visitor_stats@biomon.org');
        visitorToken = visitorData.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/stats', () => {
        it('debe crear una nueva estadística manualmente si es administrador', async () => {
            const res = await request(app)
                .post('/api/stats')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    tipo: 'Nativo',
                    planificados: 100,
                    muertos: 5
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('stat');
            expect(res.body.stat).toHaveProperty('tipo', 'nativo');
            expect(res.body.stat).toHaveProperty('planificados', 100);
            
            targetStatId = res.body.stat.id;
        });

        it('debe denegar la creación si el usuario no es admin', async () => {
            const res = await request(app)
                .post('/api/stats')
                .set('Authorization', `Bearer ${visitorToken}`)
                .send({
                    tipo: 'Exótico',
                    planificados: 50
                });

            expect(res.statusCode).toEqual(403);
        });

        it('debe retornar 400 si falta el tipo', async () => {
            const res = await request(app)
                .post('/api/stats')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    planificados: 10
                });

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('GET /api/stats', () => {
        it('debe listar todas las estadísticas si es admin', async () => {
            const res = await request(app)
                .get('/api/stats')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /api/stats/:id', () => {
        it('debe obtener el detalle de una estadística', async () => {
            const res = await request(app)
                .get(`/api/stats/${targetStatId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', targetStatId);
        });
    });

    describe('PUT /api/stats/:id', () => {
        it('debe actualizar los datos de la estadística si es admin', async () => {
            const res = await request(app)
                .put(`/api/stats/${targetStatId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    planificados: 150,
                    muertos: 10
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('stat');
            expect(res.body.stat).toHaveProperty('planificados', 150);
            expect(res.body.stat).toHaveProperty('muertos', 10);
        });
    });

    describe('POST /api/stats/recalcular', () => {
        it('debe invocar el recálculo automático de las estadísticas', async () => {
            const res = await request(app)
                .post('/api/stats/recalcular')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('stats');
            expect(Array.isArray(res.body.stats)).toBe(true);
        });
    });

    describe('DELETE /api/stats/:id', () => {
        it('debe eliminar la estadística si es admin', async () => {
            const res = await request(app)
                .delete(`/api/stats/${targetStatId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);

            const getRes = await request(app)
                .get(`/api/stats/${targetStatId}`)
                .set('Authorization', `Bearer ${adminToken}`);
                
            expect(getRes.statusCode).toEqual(404);
        });
    });
});

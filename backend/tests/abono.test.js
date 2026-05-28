const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

describe('🌱 API de Abonos - Integration Tests', () => {
    let adminToken = '';
    let visitorToken = '';
    let targetAbonoId = null;

    beforeAll(async () => {
        await setupTestDatabase();
        
        const adminData = await createAndLoginUser(1, 'admin_abonos@biomon.org');
        adminToken = adminData.token;

        const visitorData = await createAndLoginUser(3, 'visitor_abonos@biomon.org');
        visitorToken = visitorData.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/abonos', () => {
        it('debe registrar un nuevo abono si tiene permisos de admin o voluntario', async () => {
            const res = await request(app)
                .post('/api/abonos')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    nombre: 'Compost Orgánico',
                    tipo_abono: 'orgánico',
                    cantidad_kg: 50.5,
                    unidad: 'kg',
                    stock: 100
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('abono');
            expect(res.body.abono).toHaveProperty('nombre', 'Compost Orgánico');
            
            targetAbonoId = res.body.abono.id;
        });

        it('debe denegar el registro a usuarios con rol de visitante', async () => {
            const res = await request(app)
                .post('/api/abonos')
                .set('Authorization', `Bearer ${visitorToken}`)
                .send({
                    nombre: 'Fertilizante NPK'
                });

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('GET /api/abonos', () => {
        it('debe listar abonos públicamente (sin token)', async () => {
            const res = await request(app).get('/api/abonos');

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /api/abonos/:id', () => {
        it('debe obtener detalles de un abono específico (público)', async () => {
            const res = await request(app).get(`/api/abonos/${targetAbonoId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', targetAbonoId);
            expect(res.body).toHaveProperty('tipo_abono', 'orgánico');
        });

        it('debe retornar 404 si el abono no existe', async () => {
            const res = await request(app).get('/api/abonos/9999');
            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /api/abonos/:id', () => {
        it('debe permitir actualizar datos del abono', async () => {
            const res = await request(app)
                .put(`/api/abonos/${targetAbonoId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    cantidad_kg: 40,
                    stock: 80
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.abono).toHaveProperty('stock', 80);
            expect(res.body.abono).toHaveProperty('cantidad_kg', 40);
        });
    });

    describe('DELETE /api/abonos/:id', () => {
        it('debe eliminar el abono si es administrador', async () => {
            const res = await request(app)
                .delete(`/api/abonos/${targetAbonoId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');

            const getRes = await request(app).get(`/api/abonos/${targetAbonoId}`);
            expect(getRes.statusCode).toEqual(404);
        });
    });
});

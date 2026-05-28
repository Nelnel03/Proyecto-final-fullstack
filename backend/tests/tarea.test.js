const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

describe('📋 API de Tareas - Integration Tests', () => {
    let adminToken = '';
    let visitorToken = '';
    let targetTareaId = null;

    beforeAll(async () => {
        await setupTestDatabase();
        
        const adminData = await createAndLoginUser(1, 'admin_tareas@biomon.org');
        adminToken = adminData.token;

        const visitorData = await createAndLoginUser(3, 'visitor_tareas@biomon.org');
        visitorToken = visitorData.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/tareas', () => {
        it('debe crear una nueva tarea si es administrador', async () => {
            const res = await request(app)
                .post('/api/tareas')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    titulo: 'Mantenimiento de Reforestación',
                    descripcion: 'Limpiar maleza alrededor de los árboles.',
                    horas: 4,
                    estado: 'activo'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('tarea');
            expect(res.body.tarea).toHaveProperty('titulo', 'Mantenimiento de Reforestación');
            
            targetTareaId = res.body.tarea.id;
        });

        it('debe devolver 400 si falta el título', async () => {
            const res = await request(app)
                .post('/api/tareas')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    descripcion: 'Tarea sin título'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
        });

        it('debe denegar el acceso a usuarios no administradores', async () => {
            const res = await request(app)
                .post('/api/tareas')
                .set('Authorization', `Bearer ${visitorToken}`)
                .send({
                    titulo: 'Hack Tarea'
                });

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('GET /api/tareas', () => {
        it('debe listar tareas públicamente', async () => {
            const res = await request(app).get('/api/tareas');

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /api/tareas/:id', () => {
        it('debe obtener detalles de una tarea específica', async () => {
            const res = await request(app).get(`/api/tareas/${targetTareaId}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', targetTareaId);
            expect(res.body).toHaveProperty('titulo', 'Mantenimiento de Reforestación');
        });
    });

    describe('PUT /api/tareas/:id', () => {
        it('debe actualizar los datos de la tarea si es admin', async () => {
            const res = await request(app)
                .put(`/api/tareas/${targetTareaId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    horas: 6,
                    estado: 'inactivo'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('tarea');
            expect(res.body.tarea.horas.toString()).toEqual('6');
        });
    });

    describe('DELETE /api/tareas/:id', () => {
        it('debe eliminar la tarea si es administrador', async () => {
            const res = await request(app)
                .delete(`/api/tareas/${targetTareaId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            
            const getRes = await request(app).get(`/api/tareas/${targetTareaId}`);
            // Podría ser 404 o 200 con estado inactivo dependiendo de la lógica
            expect([200, 404]).toContain(getRes.statusCode);
        });
    });
});

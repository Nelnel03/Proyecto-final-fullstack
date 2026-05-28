const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

describe('⚠️ API de Reportes Generales - Integration Tests', () => {
    let adminToken = '';
    let visitorToken = '';
    let visitorId = null;
    let targetReporteId = null;

    beforeAll(async () => {
        await setupTestDatabase();
        
        const adminData = await createAndLoginUser(1, 'admin_reportesgen@biomon.org');
        adminToken = adminData.token;

        const visitorData = await createAndLoginUser(3, 'visitor_reportesgen@biomon.org');
        visitorToken = visitorData.token;
        visitorId = visitorData.user.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/reportes', () => {
        it('debe permitir a cualquier usuario autenticado crear un reporte general', async () => {
            const res = await request(app)
                .post('/api/reportes')
                .set('Authorization', `Bearer ${visitorToken}`)
                .send({
                    asunto: 'Sugerencia de mejora',
                    contenido: 'Deberían añadir más árboles en el parque central.',
                    tipo: 'sugerencia',
                    estado: 'Pendiente'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('reporte');
            expect(res.body.reporte).toHaveProperty('asunto', 'Sugerencia de mejora');
            expect(res.body.reporte).toHaveProperty('usuario_id', visitorId);
            
            targetReporteId = res.body.reporte.id;
        });

        it('debe denegar el acceso a usuarios no autenticados', async () => {
            const res = await request(app)
                .post('/api/reportes')
                .send({
                    asunto: 'Reporte anónimo'
                });

            expect(res.statusCode).toEqual(401);
        });
    });

    describe('GET /api/reportes', () => {
        it('debe listar solo los reportes del usuario actual si no es admin', async () => {
            const res = await request(app)
                .get('/api/reportes')
                .set('Authorization', `Bearer ${visitorToken}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty('usuario_id', visitorId);
        });

        it('debe listar todos los reportes si es admin', async () => {
            const res = await request(app)
                .get('/api/reportes')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /api/reportes/:id', () => {
        it('debe obtener detalles del reporte si es el dueño', async () => {
            const res = await request(app)
                .get(`/api/reportes/${targetReporteId}`)
                .set('Authorization', `Bearer ${visitorToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', targetReporteId);
        });

        it('debe denegar el acceso si un usuario normal intenta ver el reporte de otro', async () => {
            const otroData = await createAndLoginUser(3, 'otro_gen@biomon.org');
            const res = await request(app)
                .get(`/api/reportes/${targetReporteId}`)
                .set('Authorization', `Bearer ${otroData.token}`);

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('PUT /api/reportes/:id', () => {
        it('debe permitir a un administrador actualizar el estado y marcar como visto', async () => {
            const res = await request(app)
                .put(`/api/reportes/${targetReporteId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    visto: true,
                    estado: 'Resuelto'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.reporte).toHaveProperty('visto', 1);
            expect(res.body.reporte).toHaveProperty('estado', 'Resuelto');
        });
    });

    describe('DELETE /api/reportes/:id', () => {
        it('debe eliminar el reporte si es administrador', async () => {
            const res = await request(app)
                .delete(`/api/reportes/${targetReporteId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);

            const getRes = await request(app)
                .get(`/api/reportes/${targetReporteId}`)
                .set('Authorization', `Bearer ${adminToken}`);
                
            expect(getRes.statusCode).toEqual(404);
        });
    });
});

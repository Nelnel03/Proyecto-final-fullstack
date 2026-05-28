const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

describe('📋 API de Reportes de Voluntariado - Integration Tests', () => {
    let adminToken = '';
    let voluntarioToken = '';
    let voluntarioId = null;
    let targetReporteId = null;

    beforeAll(async () => {
        await setupTestDatabase();
        
        const adminData = await createAndLoginUser(1, 'admin_reportesvol@biomon.org');
        adminToken = adminData.token;

        const voluntarioData = await createAndLoginUser(2, 'voluntario_reportes@biomon.org');
        voluntarioToken = voluntarioData.token;
        voluntarioId = voluntarioData.user.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/reportes-voluntariado', () => {
        it('debe permitir a un voluntario enviar un reporte de actividad', async () => {
            const res = await request(app)
                .post('/api/reportes-voluntariado')
                .set('Authorization', `Bearer ${voluntarioToken}`)
                .send({
                    tipoTarea: 'Mantenimiento de Reforestación',
                    horas: 4,
                    tareas: 'Limpieza, Abono',
                    fecha: '2026-05-27',
                    estado: 'pendiente'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('reporte');
            expect(res.body.reporte).toHaveProperty('tipoTarea', 'Mantenimiento de Reforestación');
            expect(res.body.reporte).toHaveProperty('estado', 'pendiente');
            
            targetReporteId = res.body.reporte.id;
        });
    });

    describe('GET /api/reportes-voluntariado', () => {
        it('debe listar solo los reportes del propio voluntario', async () => {
            const res = await request(app)
                .get('/api/reportes-voluntariado')
                .set('Authorization', `Bearer ${voluntarioToken}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1);
            expect(res.body[0]).toHaveProperty('voluntario_id', voluntarioId);
        });

        it('debe listar todos los reportes si es admin', async () => {
            const res = await request(app)
                .get('/api/reportes-voluntariado')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /api/reportes-voluntariado/:id', () => {
        it('debe obtener detalles del reporte si es el dueño o admin', async () => {
            const res = await request(app)
                .get(`/api/reportes-voluntariado/${targetReporteId}`)
                .set('Authorization', `Bearer ${voluntarioToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', targetReporteId);
        });
        
        it('debe denegar el acceso si un voluntario intenta ver el reporte de otro', async () => {
            const otroVoluntarioData = await createAndLoginUser(2, 'otro_voluntario@biomon.org');
            const res = await request(app)
                .get(`/api/reportes-voluntariado/${targetReporteId}`)
                .set('Authorization', `Bearer ${otroVoluntarioData.token}`);

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('PUT /api/reportes-voluntariado/:id', () => {
        it('debe permitir a un administrador actualizar el estado del reporte', async () => {
            const res = await request(app)
                .put(`/api/reportes-voluntariado/${targetReporteId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    estado: 'aprobado',
                    visto: 1
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.reporte).toHaveProperty('estado', 'aprobado');
        });
    });

    describe('DELETE /api/reportes-voluntariado/:id', () => {
        it('debe eliminar el reporte si es administrador', async () => {
            const res = await request(app)
                .delete(`/api/reportes-voluntariado/${targetReporteId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);

            const getRes = await request(app)
                .get(`/api/reportes-voluntariado/${targetReporteId}`)
                .set('Authorization', `Bearer ${adminToken}`);
                
            expect(getRes.statusCode).toEqual(404);
        });
    });
});

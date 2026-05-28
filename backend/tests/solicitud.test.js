const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

describe('📩 API de Solicitudes de Voluntariado - Integration Tests', () => {
    let adminToken = '';
    let visitorToken = '';
    let targetSolicitudId = null;

    beforeAll(async () => {
        await setupTestDatabase();
        
        const adminData = await createAndLoginUser(1, 'admin_solicitudes@biomon.org');
        adminToken = adminData.token;

        const visitorData = await createAndLoginUser(3, 'visitor_solicitudes@biomon.org');
        visitorToken = visitorData.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/solicitudes', () => {
        it('debe permitir a un usuario normal enviar una solicitud', async () => {
            const res = await request(app)
                .post('/api/solicitudes')
                .set('Authorization', `Bearer ${visitorToken}`)
                .send({
                    mensaje: 'Me gustaría ser voluntario en reforestación.'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('solicitud');
            expect(res.body.solicitud).toHaveProperty('estado', 'pendiente');
            
            targetSolicitudId = res.body.solicitud.id;
        });

        it('debe denegar enviar otra solicitud si ya tiene una pendiente', async () => {
            const res = await request(app)
                .post('/api/solicitudes')
                .set('Authorization', `Bearer ${visitorToken}`)
                .send({
                    mensaje: 'Este mensaje no debería pasar.'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'Ya tienes una solicitud pendiente de revisión');
        });
    });

    describe('GET /api/solicitudes', () => {
        it('debe listar solicitudes y aplicar filtrado por usuario si no es admin', async () => {
            const res = await request(app)
                .get('/api/solicitudes')
                .set('Authorization', `Bearer ${visitorToken}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBe(1); // Solo la que él mismo creó
        });

        it('debe listar todas las solicitudes si es admin', async () => {
            // Un admin podría ver más si hubieran otras
            const res = await request(app)
                .get('/api/solicitudes')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('GET /api/solicitudes/:id', () => {
        it('debe obtener detalles de una solicitud específica', async () => {
            const res = await request(app)
                .get(`/api/solicitudes/${targetSolicitudId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', targetSolicitudId);
        });
    });

    describe('PUT /api/solicitudes/:id', () => {
        it('debe permitir actualizar el estado y "visto" si es administrador', async () => {
            const res = await request(app)
                .put(`/api/solicitudes/${targetSolicitudId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    estado: 'rechazada',
                    visto: true
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.solicitud).toHaveProperty('estado', 'rechazada');
        });

        it('debe denegar la actualización a usuarios normales', async () => {
            const res = await request(app)
                .put(`/api/solicitudes/${targetSolicitudId}`)
                .set('Authorization', `Bearer ${visitorToken}`)
                .send({
                    estado: 'aprobada'
                });

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('POST /api/solicitudes/:id/aprobar', () => {
        it('debe aprobar la solicitud y cambiar el rol del usuario a voluntario', async () => {
            // Primero creamos un nuevo usuario para este test porque la anterior fue rechazada y este endpoint podría esperar pendiente o simplemente ejecutar la acción.
            const userForApproval = await createAndLoginUser(3, 'approval_test@biomon.org');
            
            const createReq = await request(app)
                .post('/api/solicitudes')
                .set('Authorization', `Bearer ${userForApproval.token}`)
                .send({ mensaje: 'Quiero ser voluntario' });

            const newSolicitudId = createReq.body.solicitud.id;

            const res = await request(app)
                .post(`/api/solicitudes/${newSolicitudId}/aprobar`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('nuevo_rol_id');

            // Verificar que la solicitud ahora esté 'aprobada'
            const getReq = await request(app)
                .get(`/api/solicitudes/${newSolicitudId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(getReq.body).toHaveProperty('estado', 'aprobada');
        });
    });

    describe('DELETE /api/solicitudes/:id', () => {
        it('debe eliminar la solicitud si es administrador', async () => {
            const res = await request(app)
                .delete(`/api/solicitudes/${targetSolicitudId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);

            const getRes = await request(app)
                .get(`/api/solicitudes/${targetSolicitudId}`)
                .set('Authorization', `Bearer ${adminToken}`);
                
            expect(getRes.statusCode).toEqual(404);
        });
    });
});

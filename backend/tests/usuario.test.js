const request = require('supertest');
const app = require('../src/app');
const { sequelize, Usuario } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

describe('👥 API de Usuarios - Integration Tests', () => {
    let adminToken = '';
    let userToken = '';
    let adminUser = null;
    let targetUserId = null;

    beforeAll(async () => {
        await setupTestDatabase();
        
        const adminData = await createAndLoginUser(1, 'admin_usuarios@biomon.org');
        adminToken = adminData.token;
        adminUser = adminData.user;

        const userData = await createAndLoginUser(3, 'user_normal@biomon.org');
        userToken = userData.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/usuarios', () => {
        it('debe crear un nuevo usuario (voluntario) si es administrador', async () => {
            const res = await request(app)
                .post('/api/usuarios')
                .set('Authorization', `Bearer ${adminToken}`)
                .field('nombre', 'Nuevo Voluntario')
                .field('email', 'nuevo_voluntario@biomon.org')
                .field('password', 'SecurePass123')
                .field('rol_id', 2)
                .field('telefono', '88887777');

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('user');
            expect(res.body.user).toHaveProperty('email', 'nuevo_voluntario@biomon.org');
            
            targetUserId = res.body.user.id;
        });

        it('debe rechazar la creación de usuario si faltan campos obligatorios', async () => {
            const res = await request(app)
                .post('/api/usuarios')
                .set('Authorization', `Bearer ${adminToken}`)
                .field('email', 'sin_nombre@biomon.org');

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
        });

        it('debe denegar el acceso si el solicitante no es administrador', async () => {
            const res = await request(app)
                .post('/api/usuarios')
                .set('Authorization', `Bearer ${userToken}`)
                .field('nombre', 'Hacker')
                .field('email', 'hacker@biomon.org')
                .field('password', 'HackedPass123');

            expect(res.statusCode).toEqual(403);
        });
    });

    describe('GET /api/usuarios', () => {
        it('debe listar usuarios con rol de administrador', async () => {
            const res = await request(app)
                .get('/api/usuarios')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('items');
            expect(Array.isArray(res.body.items)).toBe(true);
            expect(res.body.items.length).toBeGreaterThanOrEqual(1);
        });

        it('debe permitir buscar usuarios por término (search)', async () => {
            const res = await request(app)
                .get('/api/usuarios?search=Nuevo Voluntario')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.items.length).toBeGreaterThanOrEqual(1);
            expect(res.body.items[0]).toHaveProperty('nombre', 'Nuevo Voluntario');
        });
    });

    describe('GET /api/usuarios/:id', () => {
        it('debe obtener detalles de un usuario específico', async () => {
            const res = await request(app)
                .get(`/api/usuarios/${targetUserId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', targetUserId);
            expect(res.body).toHaveProperty('email', 'nuevo_voluntario@biomon.org');
        });

        it('debe retornar 404 si el usuario no existe', async () => {
            const res = await request(app)
                .get('/api/usuarios/9999')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /api/usuarios/:id', () => {
        it('debe permitir a un administrador actualizar datos y el rol de un usuario', async () => {
            const res = await request(app)
                .put(`/api/usuarios/${targetUserId}`)
                .set('Authorization', `Bearer ${adminToken}`)
                .field('nombre', 'Voluntario Actualizado')
                .field('telefono', '11112222')
                .field('status', 'inactivo');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.user).toHaveProperty('nombre', 'Voluntario Actualizado');
            expect(res.body.user).toHaveProperty('telefono', '11112222');
            expect(res.body.user).toHaveProperty('status', 'inactivo');
        });
    });

    describe('DELETE /api/usuarios/:id', () => {
        it('debe borrar lógicamente (o físicamente) el usuario especificado', async () => {
            const res = await request(app)
                .delete(`/api/usuarios/${targetUserId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');

            const getRes = await request(app)
                .get(`/api/usuarios/${targetUserId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            // Depending on the implementation (soft vs hard delete), it might be 404 or just return inactive
            expect([200, 404]).toContain(getRes.statusCode);
            if (getRes.statusCode === 200) {
                expect(['baneado', 'inactivo']).toContain(getRes.body.status);
            }
        });
    });
});

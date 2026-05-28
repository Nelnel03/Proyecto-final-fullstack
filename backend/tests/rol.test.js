const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

describe('🛡️ API de Roles - Integration Tests', () => {
    let adminToken = '';
    let userToken = '';

    beforeAll(async () => {
        await setupTestDatabase();
        
        // Obtener tokens de prueba
        const adminData = await createAndLoginUser(1, 'admin_roles@biomon.org');
        adminToken = adminData.token;

        const userData = await createAndLoginUser(3, 'user_roles@biomon.org');
        userToken = userData.token;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/roles', () => {
        it('debe listar todos los roles si el usuario es administrador', async () => {
            const res = await request(app)
                .get('/api/roles')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(3); // Setup creates 3 roles
        });

        it('debe denegar el acceso a usuarios sin rol de admin', async () => {
            const res = await request(app)
                .get('/api/roles')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toEqual(403);
            expect(res.body).toHaveProperty('message');
        });

        it('debe denegar el acceso si no hay token', async () => {
            const res = await request(app).get('/api/roles');
            expect(res.statusCode).toEqual(401);
        });
    });

    describe('POST /api/roles', () => {
        it('debe crear un nuevo rol si los datos son válidos y es administrador', async () => {
            const res = await request(app)
                .post('/api/roles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    nombre: 'auditor',
                    descripcion: 'Usuario con permisos de solo lectura'
                });

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('rol');
            expect(res.body.rol).toHaveProperty('id');
            expect(res.body.rol).toHaveProperty('nombre', 'auditor');
        });

        it('debe devolver error de validación 400 si falta el nombre', async () => {
            const res = await request(app)
                .post('/api/roles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    descripcion: 'Rol sin nombre'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
        });
    });

    describe('GET /api/roles/:id', () => {
        it('debe obtener un rol específico por ID', async () => {
            const res = await request(app)
                .get('/api/roles/1')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('id', 1);
            expect(res.body).toHaveProperty('nombre', 'admin');
        });

        it('debe retornar 404 si el rol no existe', async () => {
            const res = await request(app)
                .get('/api/roles/999')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(404);
        });
    });

    describe('PUT /api/roles/:id', () => {
        it('debe actualizar la información del rol', async () => {
            const res = await request(app)
                .put('/api/roles/2')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    descripcion: 'Rol de voluntario actualizado'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('rol');
            expect(res.body.rol).toHaveProperty('descripcion', 'Rol de voluntario actualizado');
        });
    });

    describe('DELETE /api/roles/:id', () => {
        it('debe eliminar el rol si es administrador', async () => {
            // Primero creamos un rol para borrarlo
            const createRes = await request(app)
                .post('/api/roles')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({ nombre: 'temporal' });
            
            const tempRoleId = createRes.body.rol.id;

            const deleteRes = await request(app)
                .delete(`/api/roles/${tempRoleId}`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(deleteRes.statusCode).toEqual(200);
            expect(deleteRes.body).toHaveProperty('message', 'Rol eliminado correctamente');

            // Verificar que ya no existe
            const getRes = await request(app)
                .get(`/api/roles/${tempRoleId}`)
                .set('Authorization', `Bearer ${adminToken}`);
            
            expect(getRes.statusCode).toEqual(404);
        });
    });
});

const request = require('supertest');
const app = require('../src/app');
const { Usuario } = require('../src/models');

describe('Autenticación de Usuarios', () => {
    const testUser = {
        nombre: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        telefono: '88888888'
    };

    it('debe registrar un nuevo usuario exitosamente', async () => {
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Registro exitoso');
    });

    it('debe iniciar sesión con el usuario creado', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.email).toBe(testUser.email);
    });

    it('debe fallar al iniciar sesión con contraseña incorrecta', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(401);
        expect(res.body).toHaveProperty('message');
    });
});

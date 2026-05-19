const request = require('supertest');
const app = require('../src/app');
const { sequelize, Usuario, Sesion, ResetToken } = require('../src/models');
const setupTestDatabase = require('./setup');

describe('🔑 API de Autenticación - Integration Tests', () => {
    // Inicializar y limpiar base de datos de prueba antes de correr las suites
    beforeAll(async () => {
        await setupTestDatabase();
    });

    // Cerrar todas las conexiones activas al finalizar
    afterAll(async () => {
        await sequelize.close();
    });

    const mockUser = {
        nombre: 'Guardabosques Test',
        email: 'test@biomon.org',
        password: 'securePassword123'
    };

    let authToken = '';

    describe('📝 POST /api/auth/register', () => {
        it('debe registrar un nuevo usuario de forma exitosa', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(mockUser);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty('message', 'Registro exitoso');
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('email', mockUser.email);
            expect(res.body.user).not.toHaveProperty('password');
        });

        it('debe rechazar el registro si el correo electrónico ya existe', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send(mockUser);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('message', 'El correo ya está registrado');
        });

        it('debe validar la estructura requerida (ej. email inválido)', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    nombre: 'Usuario Falso',
                    email: 'correo-invalido',
                    password: '123'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('errors');
            expect(Array.isArray(res.body.errors)).toBe(true);
        });
    });

    describe('🔐 POST /api/auth/login', () => {
        it('debe denegar el acceso si la contraseña es incorrecta', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: mockUser.email,
                    password: 'contraseña_incorrecta'
                });

            expect(res.statusCode).toEqual(401);
            expect(res.body).toHaveProperty('message', 'Credenciales inválidas');
        });

        it('debe autenticar exitosamente y retornar token JWT', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: mockUser.email,
                    password: mockUser.password
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Login exitoso');
            expect(res.body).toHaveProperty('token');
            expect(res.body.user).toHaveProperty('rol', 'usuario'); // Por defecto rol_id es 3, o sea 'usuario'
            authToken = res.body.token; // Almacenar token para pruebas posteriores
        });
    });

    describe('📧 POST /api/auth/forgot-password & /reset-password', () => {
        let resetToken = '';

        it('debe procesar la solicitud de recuperación y devolver un token temporal', async () => {
            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: mockUser.email });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('token');
            resetToken = res.body.token;
        });

        it('debe permitir restablecer la contraseña usando el token temporal', async () => {
            const res = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: resetToken,
                    newPassword: 'newSuperPassword123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Contraseña actualizada correctamente.');

            // Validar que la nueva contraseña funcione al hacer login
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: mockUser.email,
                    password: 'newSuperPassword123'
                });

            expect(loginRes.statusCode).toEqual(200);
            expect(loginRes.body).toHaveProperty('token');
            authToken = loginRes.body.token; // Guardar el nuevo token para el test de logout
        });
    });

    describe('🚪 POST /api/auth/logout', () => {
        it('debe revocar la sesión activa y expirar el token de acceso', async () => {
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Sesión cerrada correctamente');
        });

        it('debe denegar el acceso a rutas protegidas una vez cerrado el logout', async () => {
            // El logout inactiva la sesión en base de datos.
            // Para verificar que la autenticación rechaza tokens revocados:
            const res = await request(app)
                .post('/api/auth/logout')
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.statusCode).toEqual(401);
        });
    });
});

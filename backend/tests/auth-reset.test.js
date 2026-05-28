const request = require('supertest');
const app = require('../src/app');
const { sequelize, Usuario, ResetToken } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');

// Mockear mailService para no enviar correos reales
jest.mock('../src/services/mailService', () => ({
    sendResetPasswordEmail: jest.fn().mockResolvedValue(true)
}));

const mailService = require('../src/services/mailService');

describe('🔐 API de Auth - Reset Password Tests', () => {
    let testUser = null;

    beforeAll(async () => {
        await setupTestDatabase();
        
        // Creamos un usuario pero no nos importa el token de login para esto
        const data = await createAndLoginUser(3, 'reset_test@biomon.org', 'oldPassword123');
        testUser = data.user;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST /api/auth/forgot-password', () => {
        it('debe generar un token de reset y simular el envío de correo si el usuario existe', async () => {
            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'reset_test@biomon.org' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Si el correo existe, recibirás instrucciones.');

            // Verificar que se llamó al mock del mailService
            expect(mailService.sendResetPasswordEmail).toHaveBeenCalledTimes(1);
            expect(mailService.sendResetPasswordEmail).toHaveBeenCalledWith(
                'reset_test@biomon.org',
                expect.any(String),
                expect.any(String) // el token
            );

            // Verificar que el token se guardó en DB
            const resetTokens = await ResetToken.findAll({ where: { usuario_id: testUser.id } });
            expect(resetTokens.length).toBe(1);
        });

        it('debe devolver el mismo mensaje aunque el usuario no exista, pero no debe crear token ni enviar correo', async () => {
            const res = await request(app)
                .post('/api/auth/forgot-password')
                .send({ email: 'no_existo@biomon.org' });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Si el correo existe, recibirás instrucciones.');

            expect(mailService.sendResetPasswordEmail).not.toHaveBeenCalled();
        });
    });

    describe('POST /api/auth/reset-password', () => {
        it('debe rechazar el reseteo si el token no existe', async () => {
            const res = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: 'invalid_token_123',
                    newPassword: 'newValidPassword123'
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('inválido');
        });

        it('debe cambiar la contraseña con un token válido', async () => {
            // Obtenemos el token válido generado en el test de forgot-password
            const validTokenRecord = await ResetToken.findOne({ where: { usuario_id: testUser.id } });
            
            const res = await request(app)
                .post('/api/auth/reset-password')
                .send({
                    token: validTokenRecord.token,
                    newPassword: 'newValidPassword123'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message', 'Contraseña actualizada correctamente.');

            // Verificar que el token fue marcado como usado
            const usedToken = await ResetToken.findOne({ where: { token: validTokenRecord.token } });
            expect(usedToken.usado).toBeTruthy();

            // Verificar que podemos hacer login con la nueva contraseña
            const loginRes = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'reset_test@biomon.org',
                    password: 'newValidPassword123'
                });
            
            expect(loginRes.statusCode).toEqual(200);
            expect(loginRes.body).toHaveProperty('token');
        });
    });
});

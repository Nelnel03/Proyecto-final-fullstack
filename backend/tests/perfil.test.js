const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');
const path = require('path');
const fs = require('fs');

// Create a dummy image file for testing
const testImgDir = path.join(__dirname, 'fixtures');
const testImgPath = path.join(testImgDir, 'test_image.jpg');

jest.mock('multer-storage-cloudinary', () => {
    return {
        CloudinaryStorage: jest.fn().mockImplementation(() => {
            return {
                _handleFile: (req, file, cb) => {
                    file.stream.on('data', () => {});
                    file.stream.on('end', () => {
                        cb(null, {
                            path: 'https://res.cloudinary.com/test/image/upload/v1/test_image.jpg',
                            filename: 'test_image'
                        });
                    });
                },
                _removeFile: (req, file, cb) => {
                    cb(null);
                }
            };
        })
    };
});

describe('🖼️ API de Perfil - Integration Tests (Uploads)', () => {
    let voluntarioToken = '';

    beforeAll(async () => {
        await setupTestDatabase();
        
        // Create fixture dir if not exists
        if (!fs.existsSync(testImgDir)) {
            fs.mkdirSync(testImgDir);
        }
        // Create a fake image file
        fs.writeFileSync(testImgPath, 'fake image content');

        const voluntarioData = await createAndLoginUser(2, 'voluntario_foto@biomon.org');
        voluntarioToken = voluntarioData.token;
    });

    afterAll(async () => {
        await sequelize.close();
        if (fs.existsSync(testImgPath)) {
            fs.unlinkSync(testImgPath);
        }
        if (fs.existsSync(testImgDir)) {
            fs.rmdirSync(testImgDir);
        }
    });

    describe('POST /api/usuarios/perfil/foto', () => {
        it('debe permitir a un usuario actualizar su propia foto de perfil', async () => {
            const res = await request(app)
                .post('/api/usuarios/perfil/foto')
                .set('Authorization', `Bearer ${voluntarioToken}`)
                .attach('foto', testImgPath);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body).toHaveProperty('fotoPerfil');
            
            // Check if profile was actually updated
            const getRes = await request(app)
                .get('/api/auth/me')
                .set('Authorization', `Bearer ${voluntarioToken}`);
            
            expect(getRes.body.fotoPerfil).toBeTruthy();
        });

        it('debe retornar error 400 si no se envía ninguna imagen', async () => {
            const res = await request(app)
                .post('/api/usuarios/perfil/foto')
                .set('Authorization', `Bearer ${voluntarioToken}`);

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toContain('No se subió ninguna imagen');
        });
    });
});

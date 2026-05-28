const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');
const setupTestDatabase = require('./setup');
const { createAndLoginUser } = require('./testUtils');
const fs = require('fs');
const path = require('path');

// Mockear cloudinary para no subir imágenes reales
jest.mock('multer-storage-cloudinary', () => {
    return {
        CloudinaryStorage: jest.fn().mockImplementation(() => {
            return {
                _handleFile: (req, file, cb) => {
                    // Consumimos el stream simulando que se subió
                    file.stream.on('data', () => {});
                    file.stream.on('end', () => {
                        cb(null, {
                            path: 'https://res.cloudinary.com/demo/image/upload/v1234/test_image.jpg',
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

describe('Rutas de Upload Genérico (/api/upload)', () => {
    let tokenAdmin;
    let testImagePath;

    beforeAll(async () => {
        await setupTestDatabase();
        
        // Crear admin y obtener token (Rol 1 = admin)
        const { token } = await createAndLoginUser(1, 'admin_upload@biomon.org', 'password123');
        tokenAdmin = token;

        // Crear una imagen falsa temporal para pruebas
        testImagePath = path.join(__dirname, 'test_upload_gen.jpg');
        fs.writeFileSync(testImagePath, 'fake image content');
    });

    afterAll(async () => {
        if (fs.existsSync(testImagePath)) {
            fs.unlinkSync(testImagePath);
        }
        await sequelize.close();
    });

    it('debe devolver 401 si no hay token', async () => {
        const res = await request(app)
            .post('/api/upload');
        expect(res.statusCode).toBe(401);
    });

    it('debe devolver 400 si no se envía ningún archivo en el campo "image"', async () => {
        const res = await request(app)
            .post('/api/upload')
            .set('Authorization', `Bearer ${tokenAdmin}`);
        expect(res.statusCode).toBe(400);
        expect(res.body.message).toMatch(/No se recibió ningún archivo/);
    });

    it('debe subir la imagen correctamente y devolver la URL segura', async () => {
        const res = await request(app)
            .post('/api/upload')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .attach('image', testImagePath);
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('url');
        expect(res.body).toHaveProperty('secure_url');
        expect(res.body.secure_url).toBe('https://res.cloudinary.com/demo/image/upload/v1234/test_image.jpg');
    });
});

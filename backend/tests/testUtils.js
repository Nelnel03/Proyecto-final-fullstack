const request = require('supertest');
const app = require('../src/app');
const { Usuario, Sesion } = require('../src/models');
const bcrypt = require('bcryptjs');

// Utility function to create a user and log them in
async function createAndLoginUser(roleId, email, password = 'securePassword123') {
    // Check if user exists
    let user = await Usuario.findOne({ where: { email } });
    
    if (!user) {
        user = await Usuario.create({
            nombre: 'Test User ' + roleId,
            email,
            password: password,
            rol_id: roleId,
            telefono: '88888888'
        });
    }

    // Login via API to generate valid JWT and DB session
    const res = await request(app)
        .post('/api/auth/login')
        .send({
            email,
            password
        });

    return { token: res.body.token, user };
}

module.exports = { createAndLoginUser };

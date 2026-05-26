require('dotenv').config();
const { sendResetPasswordEmail } = require('./src/services/mailService');

async function testMail() {
    console.log('Probando envío de correo con:');
    console.log('SMTP_USER:', process.env.SMTP_USER);
    console.log('MAIL_FROM:', process.env.MAIL_FROM);
    
    // Cambia el destinatario aquí a tu propio correo para ver si llega
    const result = await sendResetPasswordEmail(process.env.SMTP_USER, 'Test User', 'token_de_prueba_12345');
    
    if (result) {
        console.log('✅ Prueba exitosa: El correo fue aceptado por el servidor SMTP.');
    } else {
        console.log('❌ Falló el envío del correo.');
    }
}

testMail();

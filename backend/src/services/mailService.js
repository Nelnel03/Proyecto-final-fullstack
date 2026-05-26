const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 465,
  secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendResetPasswordEmail = async (toEmail, userName, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.MAIL_FROM || `"BioMon" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Recuperación de contraseña - BioMon',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #2e7d32;">BioMon</h2>
          </div>
          <p>Hola <strong>${userName}</strong>,</p>
          <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en BioMon.</p>
          <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Restablecer Contraseña</a>
          </div>
          <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
          <p style="word-break: break-all; color: #666;"><a href="${resetUrl}">${resetUrl}</a></p>
          <p>Este enlace expirará en 1 hora.</p>
          <p>Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña seguirá siendo la misma.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} BioMon System. Todos los derechos reservados.</p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de recuperación enviado: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error al enviar el correo de recuperación SMTP:', error);
    return false;
  }
};

module.exports = {
  sendResetPasswordEmail,
};

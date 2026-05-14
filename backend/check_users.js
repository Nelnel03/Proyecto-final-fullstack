const { Usuario, Rol } = require('./src/models');
async function check() {
  try {
    const users = await Usuario.findAll({ include: [{ model: Rol, as: 'rol' }] });
    console.log("USERS IN DB:", users.map(u => ({ id: u.id, email: u.email, rol: u.rol?.nombre })));
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
check();

/**
 * Genera colección y environment Postman desde rutas Express (backend/src).
 * Ejecutar: node docs/postman/generate-postman.js
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const uid = () => crypto.randomUUID();

const SAVE_TOKEN_TEST = `
if (pm.response.code === 200 || pm.response.code === 201) {
  const json = pm.response.json();
  if (json.token) {
    pm.environment.set('token', json.token);
    if (json.user && json.user.id) pm.environment.set('userId', String(json.user.id));
  }
}
`.trim();

function url(raw) {
  return { raw, host: ['{{baseUrl}}'], path: raw.replace('{{baseUrl}}', '').split('/').filter(Boolean) };
}

function jsonBody(obj) {
  return {
    mode: 'raw',
    raw: JSON.stringify(obj, null, 2),
    options: { raw: { language: 'json' } },
  };
}

function formBody(fields) {
  return {
    mode: 'formdata',
    formdata: fields.map((f) => ({
      key: f.key,
      value: f.value ?? '',
      type: f.type || 'text',
      description: f.description,
    })),
  };
}

function request(name, method, pathSuffix, opts = {}) {
  const {
    description = '',
    body,
    auth = 'inherit',
    test,
    noAuth = false,
  } = opts;
  const item = {
    name,
    request: {
      method,
      header: [],
      url: url(`{{baseUrl}}${pathSuffix}`),
      description,
    },
  };
  if (noAuth) item.request.auth = { type: 'noauth' };
  if (body) item.request.body = body;
  if (test) {
    item.event = [{ listen: 'test', script: { type: 'text/javascript', exec: test.split('\n') } }];
  }
  return item;
}

function folder(name, description, items) {
  return { name, description, item: items };
}

const collection = {
  info: {
    _postman_id: uid(),
    name: 'BioMon ADI API',
    description:
      'API REST BioMon ADI (Express 5 + MySQL). Base: {{baseUrl}}. Auth: Bearer {{token}} (login guarda token). Fuente: backend/src/routes/*.js',
    schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  auth: {
    type: 'bearer',
    bearer: [{ key: 'token', value: '{{token}}', type: 'string' }],
  },
  variable: [
    { key: 'baseUrl', value: 'http://localhost:3005/api' },
    { key: 'token', value: '' },
    { key: 'resourceId', value: '1' },
    { key: 'userId', value: '' },
  ],
  item: [
    folder('00 - Health', 'Health check (sin prefijo /api)', [
      request('GET API Root', 'GET', '', {
        description: 'GET http://localhost:3005/ — mensaje de bienvenida',
        noAuth: true,
      }),
    ]),
    folder(
      '01 - Auth',
      'Autenticación JWT + sesiones. Rate limit en login/register.',
      [
        request('POST Register', 'POST', '/auth/register', {
          description: 'Registro público. Body: nombre, email, password (min 6).',
          body: jsonBody({
            nombre: 'Usuario Prueba Postman',
            email: 'nuevo@biomon.test',
            password: 'password123',
          }),
          noAuth: true,
          test: SAVE_TOKEN_TEST,
        }),
        request('POST Login Admin', 'POST', '/auth/login', {
          description: 'Credenciales seed: admin@reforestacion.com / password123',
          body: jsonBody({ email: '{{adminEmail}}', password: '{{adminPassword}}' }),
          noAuth: true,
          test: SAVE_TOKEN_TEST,
        }),
        request('POST Login Usuario', 'POST', '/auth/login', {
          description: 'Credenciales seed: usuario@reforestacion.com',
          body: jsonBody({ email: '{{userEmail}}', password: '{{userPassword}}' }),
          noAuth: true,
          test: SAVE_TOKEN_TEST,
        }),
        request('POST Login Voluntario', 'POST', '/auth/login', {
          description: 'Credenciales seed: voluntario@reforestacion.com',
          body: jsonBody({ email: '{{voluntarioEmail}}', password: '{{voluntarioPassword}}' }),
          noAuth: true,
          test: SAVE_TOKEN_TEST,
        }),
        request('GET Me', 'GET', '/auth/me', {
          description: 'Perfil del usuario autenticado (rol fresco desde DB).',
        }),
        request('POST Logout', 'POST', '/auth/logout', {
          description: 'Revoca la sesión activa del token.',
        }),
        request('POST Forgot Password', 'POST', '/auth/forgot-password', {
          description: 'Solicitar recuperación de contraseña.',
          body: jsonBody({ email: '{{userEmail}}' }),
          noAuth: true,
        }),
        request('POST Reset Password', 'POST', '/auth/reset-password', {
          description: 'Restablecer con token del correo.',
          body: jsonBody({ token: '{{resetToken}}', newPassword: 'NuevaPass123' }),
          noAuth: true,
        }),
        request('POST Change Password', 'POST', '/auth/change-password', {
          description: 'Cambiar contraseña (autenticado). Min 6 caracteres.',
          body: jsonBody({ newPassword: 'password123' }),
        }),
      ]
    ),
    folder('02 - Árboles', 'GET público. POST/PUT admin|voluntario (multipart imagen). DELETE admin.', [
      request('GET Listar árboles', 'GET', '/arboles', { description: 'Público.', noAuth: true }),
      request('GET Árbol por ID', 'GET', '/arboles/{{resourceId}}', { description: 'Público.', noAuth: true }),
      request('POST Crear árbol', 'POST', '/arboles', {
        description: 'form-data: nombre*, tipo*, imagen (file). Campos opcionales en body.',
        body: formBody([
          { key: 'nombre', value: 'Almendro de prueba' },
          { key: 'nombreCientifico', value: 'Terminalia catappa' },
          { key: 'tipo', value: 'Nativo' },
          { key: 'progreso', value: '50' },
          { key: 'estado', value: 'vivo' },
          { key: 'imagen', type: 'file', description: 'Archivo de imagen' },
        ]),
      }),
      request('PUT Actualizar árbol', 'PUT', '/arboles/{{resourceId}}', {
        body: formBody([
          { key: 'nombre', value: 'Almendro actualizado' },
          { key: 'tipo', value: 'Nativo' },
          { key: 'progreso', value: '75' },
        ]),
      }),
      request('DELETE Eliminar árbol', 'DELETE', '/arboles/{{resourceId}}', {
        description: 'Solo admin.',
      }),
    ]),
    folder('03 - Abonos', 'GET público. Mutaciones: admin y voluntario.', [
      request('GET Listar abonos', 'GET', '/abonos', { noAuth: true }),
      request('GET Abono por ID', 'GET', '/abonos/{{resourceId}}', { noAuth: true }),
      request('POST Crear abono', 'POST', '/abonos', {
        body: jsonBody({
          nombre: 'Compost orgánico',
          stock: 10,
          unidad: 'kg',
          tipo_abono: 'orgánico',
          cantidad_kg: 2.5,
          notas: 'Prueba Postman',
        }),
      }),
      request('PUT Actualizar abono', 'PUT', '/abonos/{{resourceId}}', {
        body: jsonBody({ stock: 8, notas: 'Actualizado desde Postman' }),
      }),
      request('DELETE Eliminar abono', 'DELETE', '/abonos/{{resourceId}}', { description: 'Solo admin.' }),
    ]),
    folder(
      '04 - Reportes',
      'Buzón y robos (tipo=robo en mismo endpoint). Roles: admin, voluntario, usuario.',
      [
        request('GET Listar reportes', 'GET', '/reportes'),
        request('GET Reporte por ID', 'GET', '/reportes/{{resourceId}}'),
        request('POST Crear reporte soporte', 'POST', '/reportes', {
          body: jsonBody({
            tipo: 'soporte',
            asunto: 'Consulta técnica',
            mensaje: 'Mensaje de prueba desde Postman',
          }),
        }),
        request('POST Crear reporte robo', 'POST', '/reportes', {
          description: 'No existe /reportes_robados; usar tipo robo.',
          body: jsonBody({
            tipo: 'robo',
            tipo_arbol: 'Almendro',
            descripcion: 'Descripción del robo',
            ubicacion: 'La Angostura, sector norte',
          }),
        }),
        request('PUT Actualizar reporte', 'PUT', '/reportes/{{resourceId}}', {
          description: 'Solo admin.',
          body: jsonBody({ estado: 'En Proceso', visto: 1 }),
        }),
        request('DELETE Eliminar reporte', 'DELETE', '/reportes/{{resourceId}}', {
          description: 'Solo admin.',
        }),
      ]
    ),
    folder('05 - Reportes Voluntariado', 'admin y voluntario.', [
      request('GET Listar', 'GET', '/reportes-voluntariado'),
      request('GET Por ID', 'GET', '/reportes-voluntariado/{{resourceId}}'),
      request('POST Crear', 'POST', '/reportes-voluntariado', {
        body: jsonBody({
          tareaId: 1,
          tipoTarea: 'Reforestación',
          horas: 4,
          descripcion: 'Jornada de siembra',
          estado: 'pendiente',
        }),
      }),
      request('PUT Actualizar', 'PUT', '/reportes-voluntariado/{{resourceId}}', {
        description: 'Solo admin.',
        body: jsonBody({ estado: 'aprobado' }),
      }),
      request('DELETE Eliminar', 'DELETE', '/reportes-voluntariado/{{resourceId}}', {
        description: 'Solo admin.',
      }),
    ]),
    folder('06 - Solicitudes Voluntariado', 'Usuario crea; admin aprueba.', [
      request('GET Listar', 'GET', '/solicitudes'),
      request('GET Por ID', 'GET', '/solicitudes/{{resourceId}}'),
      request('POST Crear solicitud', 'POST', '/solicitudes', {
        body: jsonBody({ mensaje: 'Deseo ser voluntario en el corredor biológico.' }),
      }),
      request('POST Aprobar solicitud', 'POST', '/solicitudes/{{resourceId}}/aprobar', {
        description: 'Solo admin. Cambia rol a voluntario.',
      }),
      request('PUT Actualizar', 'PUT', '/solicitudes/{{resourceId}}', {
        description: 'Solo admin.',
        body: jsonBody({ estado: 'aprobada' }),
      }),
      request('DELETE Eliminar', 'DELETE', '/solicitudes/{{resourceId}}', { description: 'Solo admin.' }),
    ]),
    folder('07 - Tareas', 'GET público. CRUD solo admin.', [
      request('GET Listar tareas', 'GET', '/tareas', { noAuth: true }),
      request('GET Tarea por ID', 'GET', '/tareas/{{resourceId}}', { noAuth: true }),
      request('POST Crear tarea', 'POST', '/tareas', {
        body: jsonBody({ titulo: 'Siembra de mangle', horas: 3 }),
      }),
      request('PUT Actualizar tarea', 'PUT', '/tareas/{{resourceId}}', {
        body: jsonBody({ titulo: 'Siembra de mangle (actualizada)' }),
      }),
      request('DELETE Eliminar tarea', 'DELETE', '/tareas/{{resourceId}}'),
    ]),
    folder('08 - Usuarios', 'Admin CRUD. Cualquier rol: foto de perfil.', [
      request('POST Foto de perfil', 'POST', '/usuarios/perfil/foto', {
        description: 'form-data campo foto (file). Cualquier usuario autenticado.',
        body: formBody([{ key: 'foto', type: 'file', description: 'Imagen de perfil' }]),
      }),
      request('GET Listar usuarios', 'GET', '/usuarios'),
      request('GET Usuario por ID', 'GET', '/usuarios/{{resourceId}}'),
      request('POST Crear usuario', 'POST', '/usuarios', {
        description: 'Admin. Password: min 8, número y mayúscula. form-data opcional fotoPerfil.',
        body: formBody([
          { key: 'nombre', value: 'Nuevo Admin Test' },
          { key: 'email', value: 'admin.test@biomon.org' },
          { key: 'password', value: 'Password1' },
          { key: 'rol_id', value: '3' },
          { key: 'telefono', value: '+50688888888' },
        ]),
      }),
      request('PUT Actualizar usuario', 'PUT', '/usuarios/{{resourceId}}', {
        body: formBody([{ key: 'nombre', value: 'Nombre actualizado' }, { key: 'status', value: 'activo' }]),
      }),
      request('DELETE Eliminar usuario', 'DELETE', '/usuarios/{{resourceId}}'),
    ]),
    folder('09 - Roles', 'Solo admin.', [
      request('GET Listar roles', 'GET', '/roles'),
      request('GET Rol por ID', 'GET', '/roles/{{resourceId}}'),
      request('POST Crear rol', 'POST', '/roles', {
        body: jsonBody({ nombre: 'coordinador', descripcion: 'Rol de prueba' }),
      }),
      request('PUT Actualizar rol', 'PUT', '/roles/{{resourceId}}', {
        body: jsonBody({ nombre: 'coordinador', descripcion: 'Actualizado' }),
      }),
      request('DELETE Eliminar rol', 'DELETE', '/roles/{{resourceId}}'),
    ]),
    folder('10 - Stats', 'Estadísticas por tipo. Solo admin.', [
      request('POST Recalcular stats', 'POST', '/stats/recalcular', {
        description: 'Recalcula métricas desde árboles en BD.',
      }),
      request('GET Listar stats', 'GET', '/stats'),
      request('GET Stat por ID', 'GET', '/stats/{{resourceId}}'),
      request('POST Crear stat', 'POST', '/stats', {
        body: jsonBody({ tipo: 'Nativo', cantidad: 0 }),
      }),
      request('PUT Actualizar stat', 'PUT', '/stats/{{resourceId}}', {
        body: jsonBody({ cantidad: 5 }),
      }),
      request('DELETE Eliminar stat', 'DELETE', '/stats/{{resourceId}}'),
    ]),
    folder('11 - Upload', 'Subida genérica a Cloudinary.', [
      request('POST Subir imagen', 'POST', '/upload', {
        description: 'form-data campo image (file). Requiere JWT.',
        body: formBody([{ key: 'image', type: 'file', description: 'Imagen jpg/png/webp' }]),
      }),
    ]),
  ],
};

// Fix Health request - it's not under /api
collection.item[0].item[0].request.url = {
  raw: 'http://localhost:3005/',
  protocol: 'http',
  host: ['localhost'],
  port: '3005',
  path: [''],
};

const environment = {
  id: uid(),
  name: 'BioMon Local',
  values: [
    { key: 'baseUrl', value: 'http://localhost:3005/api', type: 'default', enabled: true },
    { key: 'token', value: '', type: 'secret', enabled: true },
    { key: 'resourceId', value: '1', type: 'default', enabled: true },
    { key: 'userId', value: '', type: 'default', enabled: true },
    { key: 'resetToken', value: '', type: 'default', enabled: true },
    { key: 'adminEmail', value: 'admin@reforestacion.com', type: 'default', enabled: true },
    { key: 'adminPassword', value: 'password123', type: 'secret', enabled: true },
    { key: 'userEmail', value: 'usuario@reforestacion.com', type: 'default', enabled: true },
    { key: 'userPassword', value: 'password123', type: 'secret', enabled: true },
    { key: 'voluntarioEmail', value: 'voluntario@reforestacion.com', type: 'default', enabled: true },
    { key: 'voluntarioPassword', value: 'password123', type: 'secret', enabled: true },
  ],
  _postman_variable_scope: 'environment',
  _postman_exported_at: new Date().toISOString(),
  _postman_exported_using: 'BioMon generate-postman.js',
};

const dir = __dirname;
fs.writeFileSync(
  path.join(dir, 'BioMon-ADI-API.postman_collection.json'),
  JSON.stringify(collection, null, 2),
  'utf8'
);
fs.writeFileSync(
  path.join(dir, 'BioMon-Local.postman_environment.json'),
  JSON.stringify(environment, null, 2),
  'utf8'
);
console.log('✅ Generados: BioMon-ADI-API.postman_collection.json, BioMon-Local.postman_environment.json');

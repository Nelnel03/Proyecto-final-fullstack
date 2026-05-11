const fs = require('fs');
const data = fs.readFileSync('db.json', 'utf8');

console.log('usuario:', data.indexOf('"rol": "usuario"'));
console.log('admin:', data.indexOf('"rol": "admin"'));
console.log('voluntario:', data.indexOf('"rol": "voluntario"'));
console.log('buzon:', data.indexOf('"buzon":'));
console.log('solicitud:', data.indexOf('"estado": "solicitado"'));
console.log('enviado:', data.indexOf('"estado": "enviado"'));

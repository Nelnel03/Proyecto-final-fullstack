const fs = require('fs');
let data = fs.readFileSync('db.json', 'utf8');
let fixIndex = data.indexOf('    {\r\n      "voluntarioId": "2e66",');
if (fixIndex === -1) fixIndex = data.indexOf('    {\n      "voluntarioId": "2e66",');
if (fixIndex !== -1) {
  data = data.substring(0, fixIndex);
  data += `  ],
  "tareas_disponibles": [
    { "id": "1", "titulo": "Mantenimiento", "descripcion": "Podar, limpiar el área y revisar herramientas.", "horas": 4, "dias": "Lunes a Viernes" },
    { "id": "2", "titulo": "Plantación", "descripcion": "Poner plantines en su área respectiva y agregar abono.", "horas": 5, "dias": "Lunes a Jueves" },
    { "id": "3", "titulo": "Recolección de plásticos y basura", "descripcion": "Recorrer el sendero C y recoger residuos.", "horas": 3, "dias": "Sábados" },
    { "id": "4", "titulo": "Colocación de abonos", "descripcion": "Distribuir compost orgánico en la zona D.", "horas": 2.5, "dias": "Martes y Jueves" }
  ]
}`;
  fs.writeFileSync('db.json', data);
  console.log('Fixed from fixIndex');
} else {
  console.log('Could not find fixIndex');
}

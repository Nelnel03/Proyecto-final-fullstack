const fs = require('fs');
const data = fs.readFileSync('db.json', 'utf8');

const keys = ['arboles', 'buzon', 'voluntariados', 'reportes_voluntariado', 'tareas_disponibles'];

keys.forEach(key => {
    let count = 0;
    let pos = -1;
    while ((pos = data.indexOf('"' + key + '":', pos + 1)) !== -1) {
        count++;
        console.log(`Key "${key}" found at index: ${pos}`);
    }
    console.log(`Total count for "${key}": ${count}`);
});
console.log('Searching for common fields like "voluntarioId"');
let countVid = 0;
let posVid = -1;
while ((posVid = data.indexOf('"voluntarioId":', posVid + 1)) !== -1) {
    countVid++;
}
console.log(`Total "voluntarioId" entries found: ${countVid}`);

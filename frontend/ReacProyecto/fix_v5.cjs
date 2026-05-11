const fs = require('fs');
const data = fs.readFileSync('db.json', 'utf8');

const findAnyObjectsWithAnyOfKeys = (keys) => {
    let objects = [];
    let discoveredIndices = new Set();
    
    keys.forEach(key => {
        let pos = -1;
        while ((pos = data.indexOf('"' + key + '":', pos + 1)) !== -1) {
            // Find the start of the object {
            let objStart = data.lastIndexOf('{', pos);
            if (objStart === -1 || discoveredIndices.has(objStart)) continue;
            
            // Find the end by balancing braces, but limited to a reasonable size
            let balance = 0;
            let foundEnd = false;
            for (let i = objStart; i < data.length && i < objStart + 200000; i++) { // Limit 200KB per object
                if (data[i] === '{') balance++;
                else if (data[i] === '}') balance--;
                
                if (balance === 0) {
                    try {
                        let obj = JSON.parse(data.substring(objStart, i + 1));
                        objects.push(obj);
                        discoveredIndices.add(objStart);
                        foundEnd = true;
                        break;
                    } catch (e) {
                        break; 
                    }
                }
            }
        }
    });
    return objects;
};

const allObjects = findAnyObjectsWithAnyOfKeys([
    'nombreCientifico', // trees
    'mensaje', // buzon
    'rol', // users
    'voluntarioId', // reports
    'titulo' // tasks or trees
]);

const newDb = {
    arboles: allObjects.filter(o => o.nombreCientifico),
    buzon: allObjects.filter(o => o.mensaje && !o.rol),
    voluntariados: allObjects.filter(o => o.rol),
    reportes_voluntariado: allObjects.filter(o => o.voluntarioId),
    tareas_disponibles: allObjects.filter(o => o.titulo && !o.nombreCientifico && !o.voluntarioId && !o.rol)
};

// De-duplicate by ID
const dedupe = (arr) => {
    const unique = {};
    arr.forEach(o => unique[o.id || Math.random()] = o);
    return Object.values(unique);
};

newDb.arboles = dedupe(newDb.arboles);
newDb.buzon = dedupe(newDb.buzon);
newDb.voluntariados = dedupe(newDb.voluntariados);
newDb.reportes_voluntariado = dedupe(newDb.reportes_voluntariado);
newDb.tareas_disponibles = dedupe(newDb.tareas_disponibles);

fs.writeFileSync('db.json', JSON.stringify(newDb, null, 2));
console.log('Database reconstructed and saved.');
console.log('Counts:', {
    arboles: newDb.arboles.length,
    buzon: newDb.buzon.length,
    voluntariados: newDb.voluntariados.length,
    reportes_voluntariado: newDb.reportes_voluntariado.length,
    tareas_disponibles: newDb.tareas_disponibles.length
});

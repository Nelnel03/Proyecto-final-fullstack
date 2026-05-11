const fs = require('fs');
const data = fs.readFileSync('db.json', 'utf8');

const recoverArray = (key) => {
    let startTag = '"' + key + '": [';
    let startIndex = data.indexOf(startTag);
    if (startIndex === -1) return [];
    
    let content = data.substring(startIndex + startTag.length);
    let objects = [];
    let objStart = -1;
    let balance = 0;
    
    for (let i = 0; i < content.length; i++) {
        if (content[i] === '{') {
            if (balance === 0) objStart = i;
            balance++;
        } else if (content[i] === '}') {
            balance--;
            if (balance === 0 && objStart !== -1) {
                try {
                    let objStr = content.substring(objStart, i + 1);
                    let obj = JSON.parse(objStr);
                    objects.push(obj);
                } catch (e) {}
            }
        } else if (content[i] === ']' && balance === 0) {
            break; // Array closed
        }
    }
    return objects;
};

// Also try to find ALL objects with certain fields regardless of location
const findAnyObjects = (searchField) => {
    let objects = [];
    let pos = -1;
    while ((pos = data.indexOf('"' + searchField + '":', pos + 1)) !== -1) {
        // Find the start of the object {
        let objStart = data.lastIndexOf('{', pos);
        if (objStart === -1) continue;
        
        // Find the end by balancing braces
        let balance = 0;
        for (let i = objStart; i < data.length; i++) {
            if (data[i] === '{') balance++;
            else if (data[i] === '}') balance--;
            
            if (balance === 0) {
                try {
                    let obj = JSON.parse(data.substring(objStart, i + 1));
                    objects.push(obj);
                    pos = i; // skip this object
                    break;
                } catch (e) {
                    break; // break balance loop, try next pos
                }
            }
        }
    }
    return objects;
};

const newDb = {
    arboles: recoverArray('arboles'),
    buzon: recoverArray('buzon'),
    voluntariados: recoverArray('voluntariados'),
    reportes_voluntariado: recoverArray('reportes_voluntariado'),
    tareas_disponibles: recoverArray('tareas_disponibles')
};

// De-duplicate reportes by ID if we found duplicates
const uniqueReports = {};
newDb.reportes_voluntariado.forEach(r => uniqueReports[r.id || Math.random()] = r);
newDb.reportes_voluntariado = Object.values(uniqueReports);

// If buzon or voluntariados are empty, try to find them by fields
if (newDb.buzon.length === 0) {
    let recovered = findAnyObjects('mensaje'); // reports in buzon have 'mensaje'
    newDb.buzon = recovered;
}
if (newDb.voluntariados.length === 0) {
    let recovered = findAnyObjects('rol'); // users have 'rol'
    newDb.voluntariados = recovered;
}

fs.writeFileSync('db.json', JSON.stringify(newDb, null, 2));
console.log('Database reconstructed and saved.');
console.log('Counts:', {
    arboles: newDb.arboles.length,
    buzon: newDb.buzon.length,
    voluntariados: newDb.voluntariados.length,
    reportes_voluntariado: newDb.reportes_voluntariado.length,
    tareas_disponibles: newDb.tareas_disponibles.length
});

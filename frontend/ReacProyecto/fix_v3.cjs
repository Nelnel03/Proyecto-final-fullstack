const fs = require('fs');
let data = fs.readFileSync('db.json', 'utf8');

const findKey = (key) => {
    let index = data.indexOf('"' + key + '":');
    console.log(`Key "${key}" at: ${index}`);
    return index;
};

const keys = ['arboles', 'buzon', 'voluntariados', 'reportes_voluntariado', 'tareas_disponibles'];
const positions = keys.map(k => ({key: k, pos: findKey(k)})).filter(p => p.pos !== -1);

if (positions.length > 0) {
    // Sort positions by pos
    positions.sort((a, b) => a.pos - b.pos);
    console.log('Sorted keys position order:', positions);
    
    // Try to construct a new JSON by finding the end of each section
    let newObj = {};
    for (let i = 0; i < positions.length; i++) {
        let start = positions[i].pos;
        let end = (i + 1 < positions.length) ? positions[i + 1].pos : data.length;
        
        // Take everything between this key and next key
        let chunk = data.substring(start, end).trim();
        // Remove trailing comma if it exists (it will be before next key)
        if (chunk.endsWith(',')) chunk = chunk.slice(0, -1);
        
        // Let's try to extract the array part [ ... ]
        let arrayStart = chunk.indexOf('[');
        let arrayEnd = chunk.lastIndexOf(']');
        if (arrayStart !== -1 && arrayEnd !== -1) {
            let arrayStr = chunk.substring(arrayStart, arrayEnd + 1);
            try {
                // If the array itself is broken, let's try to fix it more brutally
                // by finding all { ... } objects inside
                let objects = [];
                let objStart = -1;
                let balance = 0;
                for (let j = 0; j < arrayStr.length; j++) {
                    if (arrayStr[j] === '{') {
                        if (balance === 0) objStart = j;
                        balance++;
                    } else if (arrayStr[j] === '}') {
                        balance--;
                        if (balance === 0 && objStart !== -1) {
                            try {
                                let obj = JSON.parse(arrayStr.substring(objStart, j + 1));
                                objects.push(obj);
                            } catch (e) {
                                // console.log('Found broken object, skipping it');
                            }
                        }
                    }
                }
                newObj[positions[i].key] = objects;
                console.log(`Recovered ${objects.length} objects for ${positions[i].key}`);
            } catch (e) {
                console.log(`Failed to parse array for ${positions[i].key}`);
            }
        }
    }
    
    fs.writeFileSync('db_fixed.json', JSON.stringify(newObj, null, 2));
    console.log('Written to db_fixed.json');
}

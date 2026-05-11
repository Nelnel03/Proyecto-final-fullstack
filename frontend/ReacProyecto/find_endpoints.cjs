const fs = require('fs');
const dir = 'src/services/';
const endpoints = new Set();
fs.readdirSync(dir).forEach(f => {
    if (f.endsWith('.service.jsx')) {
        const content = fs.readFileSync(dir + f, 'utf8');
        // Regex to find BASE_URL/something
        const regex = /BASE_URL\}\/([^?`'"]+)/g;
        let match;
        while ((match = regex.exec(content)) !== null) {
            let ep = match[1];
            // Remove everything after first slash if any (for subroutes)
            ep = ep.split('/')[0];
            endpoints.add(ep);
            console.log(`${f} -> ${ep}`);
        }
    }
});
console.log('Final endpoints list:', Array.from(endpoints));

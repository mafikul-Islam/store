const fs = require('fs');
const path = require('path');

const dir = 'php_export';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.php'));

files.forEach(file => {
    let filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');

    content = content.replace(/\.font-serif \{ font-family: 'Space Grotesk', serif; \}/g, ".font-serif { font-family: 'Playfair Display', serif; }");

    fs.writeFileSync(filepath, content);
});
console.log('Fixed inline style fonts in PHP files');

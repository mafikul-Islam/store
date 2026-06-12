const fs = require('fs');
const path = require('path');
const dir = 'php_export';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.php'));

files.forEach(f => {
    let p = path.join(dir, f);
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace various messy nav bg classes with the clean React one
    content = content.replace(/bg-white dark:bg-gray-900\/80 dark:bg-gray-950\/80/g, 'bg-white/80 dark:bg-gray-950/80');
    content = content.replace(/bg-white dark:bg-gray-900\/80/g, 'bg-white/80 dark:bg-gray-950/80');
    
    fs.writeFileSync(p, content);
});
console.log('Fixed navs');

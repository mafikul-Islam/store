const fs = require('fs');
let content = fs.readFileSync('php_export/index.php', 'utf8');
content = content.replace(
    'bg-black dark:bg-white/5 dark:bg-white/10 px-3 py-1 text-sm font-medium text-gray-900',
    'bg-gray-100 dark:bg-white/10 px-3 py-1 text-sm font-medium text-gray-900'
);
fs.writeFileSync('php_export/index.php', content);
console.log('Fixed index.php');

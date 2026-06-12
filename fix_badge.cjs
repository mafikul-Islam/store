const fs = require('fs');

let f = 'php_export/index.php';
let content = fs.readFileSync(f, 'utf8');

// replace bg-gray-100 with bg-black/5
content = content.replace(
  'bg-gray-100 dark:bg-white/10 px-3 py-1 text-sm font-medium text-gray-900',
  'bg-black/5 dark:bg-white/10 px-3 py-1 text-sm font-medium text-gray-900'
);

fs.writeFileSync(f, content);
console.log('Fixed index badge bg');

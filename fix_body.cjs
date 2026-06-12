const fs = require('fs');

let f = 'php_export/product.php';
let content = fs.readFileSync(f, 'utf8');

content = content.replace(
  'body class="min-h-screen bg-white dark:bg-gray-900 flex flex-col transition-colors duration-200"',
  'body class="min-h-screen bg-white dark:bg-gray-950 flex flex-col transition-colors duration-200"'
);

fs.writeFileSync(f, content);
console.log('Fixed body in product');

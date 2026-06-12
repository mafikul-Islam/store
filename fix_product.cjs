const fs = require('fs');
let f = 'php_export/product.php';
let content = fs.readFileSync(f, 'utf8');

content = content.replace('rounded-full   px-8', 'rounded-full bg-white dark:bg-gray-900 px-8');
content = content.replace('hover:bg-gray-50  transition-all', 'hover:bg-gray-50 dark:hover:bg-gray-800 transition-all');

// Oh wait, index.php had another bad button: "View All Products" for mobile
// Let's fix it in index.php again
let f2 = 'php_export/index.php';
let content2 = fs.readFileSync(f2, 'utf8');
content2 = content2.replace('rounded-full   px-8', 'rounded-full bg-white dark:bg-gray-900 px-8');
fs.writeFileSync(f2, content2);
fs.writeFileSync(f, content);

console.log('Fixed more buttons');

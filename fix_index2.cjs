const fs = require('fs');
let f = 'php_export/index.php';
let content = fs.readFileSync(f, 'utf8');

content = content.replace('border-0 /5', 'border-0 bg-white/5');
content = content.replace(/>\n\s* View Featured/g, 'bg-white dark:bg-gray-950>\n View Featured');
content = content.replace(/'\s+px-8\s+py-3\s+text-sm/g, '\'bg-white dark:bg-gray-900 px-8 py-3 text-sm');

// Also the "View all products" button
content = content.replace('rounded-full   px-8', 'rounded-full bg-white dark:bg-gray-900 px-8');

// For the email address, remove the duplicate bg-white dark:bg-gray-800 from end of class string
content = content.replace(/placeholder:text-gray-500 bg-white dark:bg-gray-800"/, 'placeholder:text-gray-500"');

fs.writeFileSync(f, content);
console.log('Fixed buttons and inputs in index.php');

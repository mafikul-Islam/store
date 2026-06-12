const fs = require('fs');
const glob = require('glob'); // Note: we'll just read dir directly to avoid dependency issues

const files = fs.readdirSync('php_export').filter(f => f.endsWith('.php'));

for (let file of files) {
    let filePath = 'php_export/' + file;
    let content = fs.readFileSync(filePath, 'utf8');

    // Add separator after Admin Dashboard
    content = content.replace(
        /(<a href="dashboard\.php"[^>]*>\s*Admin Dashboard\s*<\/a>\s*)(<\?php endif; \?>)/g,
        '$1<div class="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden md:block"></div>\n $2'
    );
    
    // Change Hi, User color
    content = content.replace(
        /class="text-sm font-medium text-gray-700([^"]*) hidden sm:inline-block">Hi,/g,
        'class="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline-block">Hi,'
    );

    // Also some files might just use text-gray-700 without dark:text-gray-300
    // so we handle it generically above.

    fs.writeFileSync(filePath, content);
}
console.log('Fixed PHP navbars');

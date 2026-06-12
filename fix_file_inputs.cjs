const fs = require('fs');

['php_export/add.php', 'php_export/update.php'].forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    content = content.replace('dark:file: dark:file:text-black', 'dark:file:bg-white dark:file:text-black');
    fs.writeFileSync(f, content);
});
console.log('Fixed file input classes');

const fs = require('fs');
const path = require('path');

const dir = 'php_export';
const files = ['add.php', 'update.php', 'dashboard.php'];

files.forEach(file => {
    let filepath = path.join(dir, file);
    if (!fs.existsSync(filepath)) return;
    let content = fs.readFileSync(filepath, 'utf8');

    // For inputs in dashboard.php
    content = content.replace(/class="block w-24 rounded-md border-0 py-1\.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/g, 
                             'class="block w-24 rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white bg-transparent dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"');

    content = content.replace(/class="block w-20 rounded-md border-0 py-1\.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/g, 
                             'class="block w-20 rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white bg-transparent dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"');

    // For inputs in add.php and update.php
    content = content.replace(/class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/g,
                              'class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white bg-transparent dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"');

    content = content.replace(/class="block w-full rounded-md border-0 py-2\.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"/g,
                              'class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 dark:text-white bg-transparent dark:bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"');

    fs.writeFileSync(filepath, content);
});

console.log('done inputs');

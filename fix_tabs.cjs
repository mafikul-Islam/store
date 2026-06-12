const fs = require('fs');

const tabs = `
 <nav class="-mb-px flex space-x-8" aria-label="Tabs">
 <a href="dashboard.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium \${isDashboard ? 'border-black dark:border-white text-black dark:text-white relative top-[1px]' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:border-gray-700 hover:text-gray-700'}">
 Inventory
 </a>
 <a href="orders.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium \${!isDashboard ? 'border-black dark:border-white text-black dark:text-white relative top-[1px]' : 'border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:border-gray-700 hover:text-gray-700'}">
 Orders
 </a>
 </nav>
`;

['php_export/dashboard.php', 'php_export/orders.php'].forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    const isD = file.includes('dashboard');
    const specificTabs = tabs.replace(/\$\{isDashboard \? '([^']+)' : '([^']+)'\}/g, isD ? '$1' : '$2')
                             .replace(/\$\{!isDashboard \? '([^']+)' : '([^']+)'\}/g, !isD ? '$1' : '$2');
    
    text = text.replace(/<nav class="-mb-px[\s\S]*?<\/nav>/, specificTabs.trim());
    fs.writeFileSync(file, text);
});
console.log('Tabs fixed!');

const fs = require('fs');

const bgHtml = `
<div class="fixed inset-0 -z-50 overflow-hidden pointer-events-none transition-colors duration-300">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-gray-200/50 dark:from-gray-800/50 to-transparent blur-3xl opacity-50 dark:opacity-30 pointer-events-none"></div>
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-900/20 rounded-full blur-[100px] opacity-50 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-50 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
</div>
`;

function injectBg(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (let dirent of files) {
        const fullPath = dir + '/' + dirent.name;
        if (dirent.isDirectory()) {
            if (dirent.name !== 'node_modules' && dirent.name !== '.git') {
                injectBg(fullPath);
            }
        } else if (dirent.isFile() && fullPath.endsWith('.php')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Remove any old background class from body
            content = content.replace(/<body class="([^"]*)">/, (match, cls) => {
                let newCls = cls.replace(/bg-gray-50/g, '').replace(/dark:bg-gray-950/g, '').replace(/dark:bg-gray-900/g, '').trim();
                newCls += ' bg-gray-50 dark:bg-gray-950'; // Add it back clean
                return `<body class="${newCls}">`;
            });

            // Insert background right after <body ...>
            if (!content.includes('bg-[url(')) {
                content = content.replace(/(<body[^>]*>)/, '$1\n' + bgHtml);
            }

            // Also, update the hover effect on homepage buttons
            if (fullPath.includes('index.php')) {
                // "Shop Collection" button
                content = content.replace(/class="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-8 py-3.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors w-full sm:w-auto active:scale-95"/g, 'class="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-8 py-3.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full sm:w-auto active:scale-95"');
                // "View Featured" button
                content = content.replace(/class="inline-flex items-center justify-center rounded-full bg-white dark:bg-gray-900 px-8 py-3.5 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors w-full sm:w-auto backdrop-blur-sm active:scale-95"/g, 'class="inline-flex items-center justify-center rounded-full bg-white dark:bg-gray-900 px-8 py-3.5 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full sm:w-auto backdrop-blur-sm active:scale-95"');
            }
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log("Injected BG into", fullPath);
            }
        }
    }
}

injectBg('php_export');
console.log('Done injecting bg');

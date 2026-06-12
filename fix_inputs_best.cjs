const fs = require('fs');
const path = require('path');

const dir = 'php_export';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.php'));

files.forEach(file => {
    let filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');

    // Just replace anywhere we see class= with text-gray-900 dark:text-white that is clearly an input
    // and replace bg-transparent or whatever with bg-white dark:bg-gray-800

    content = content.replace(/class="([^"]+)"/g, (match, cls) => {
        if (cls.includes('text-gray-900') && cls.includes('dark:text-white') && (cls.includes('ring-') || cls.includes('shadow-sm') || cls.includes('border'))) {
            // Check if it's likely an input (w-full or w-24, rounded-md, etc)
            if (cls.includes('rounded-md') || cls.includes('rounded-full')) {
                // remove existing bgs
                cls = cls.replace(/\bbg-transparent\b/g, '');
                cls = cls.replace(/\bbg-white\b/g, '');
                cls = cls.replace(/\bdark:bg-gray-\d+\b/g, '');
                
                // Add new bgs
                // Wait, if it's the premium experience badge, it has rounded-full, ring-1, text-gray-900 dark:text-white...
                // Only do this if it's an input. The easiest way is to look for "focus:ring" which inputs have.
                if (cls.includes('focus:ring')) {
                     cls = cls.trim() + ' bg-white dark:bg-gray-800';
                }
            }
        }
        return `class="${cls}"`;
    });

    fs.writeFileSync(filepath, content);
});

console.log('Fixed inputs via focus:ring');

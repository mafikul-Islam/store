const fs = require('fs');
const path = require('path');

const dir = 'php_export';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.php'));

files.forEach(file => {
    let filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');

    // Make sure all <input>, <textarea>, <select> have bg-white and dark:bg-gray-800
    // We will find these tags and replace their class string
    const tags = ['input', 'textarea', 'select'];
    tags.forEach(tag => {
        let regex = new RegExp(`<${tag}[^>]*class="([^"]+)"[^>]*>`, 'gi');
        content = content.replace(regex, (match, p1) => {
            let cls = p1;
            // Let's only modify inputs that have text colors or borders, i.e., not custom hidden inputs
            if (cls.includes('text-gray') || cls.includes('ring-') || cls.includes('border')) {
                // remove existing bg-transparent, bg-white, dark:bg-gray-900, dark:bg-gray-800
                cls = cls.replace(/\bbg-transparent\b/g, '');
                cls = cls.replace(/\bbg-white\b/g, '');
                cls = cls.replace(/\bdark:bg-gray-\d+\b/g, '');
                // Also fixing text color to make sure it's white in dark mode and black/gray in light mode
                
                // Add bg-white dark:bg-gray-800
                cls = cls.trim() + ' bg-white dark:bg-gray-800';
            }
            return match.replace(p1, cls);
        });
    });

    fs.writeFileSync(filepath, content);
});

console.log('Fixed inputs via regex');

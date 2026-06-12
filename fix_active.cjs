const fs = require('fs');

function walk(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (let dirent of files) {
        const fullPath = dir + '/' + dirent.name;
        if (dirent.isDirectory()) {
            if (dirent.name !== 'node_modules' && dirent.name !== '.git') {
                walk(fullPath);
            }
        } else if (dirent.isFile() && (fullPath.endsWith('.php') || fullPath.endsWith('.tsx'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // Find class="..." or className="..."
            content = content.replace(/(class(?:Name)?="[^"]*?")/g, (match) => {
                if (match.includes('rounded-') && // usually buttons are rounded
                    (match.includes('bg-') || match.includes('text-')) && 
                    !match.includes('active:scale-95') &&
                    !match.includes('translate-y') && // avoid the taka wrapper
                    !match.includes('block w-full rounded-md border-0') && // avoid inputs
                    !match.includes('fixed inset-0')) // avoid overlays
                {
                    // If it has px- and py- or w- h-, and transition, it's likely a button or icon button
                    if ((match.includes('px-') && match.includes('py-')) || 
                        (match.includes('h-') && match.includes('w-') && match.includes('flex'))) {
                        return match.replace(/"$/, ' active:scale-95"');
                    }
                }
                return match;
            });
            
            if (content !== fs.readFileSync(fullPath, 'utf8')) {
                fs.writeFileSync(fullPath, content);
                console.log("Updated active:scale-95", fullPath);
            }
        }
    }
}

walk('src');
walk('php_export');

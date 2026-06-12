const fs = require('fs');

function wrapTaka(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (let dirent of files) {
        const fullPath = dir + '/' + dirent.name;
        if (dirent.isDirectory()) {
            if (dirent.name !== 'node_modules' && dirent.name !== '.git') {
                wrapTaka(fullPath);
            }
        } else if (dirent.isFile() && (fullPath.endsWith('.php') || fullPath.endsWith('.tsx'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            const spanClass = fullPath.endsWith('.tsx') ? 'className="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]"' : 'class="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]"';

            // Wrap ৳
            content = content.replace(/(?<!<span[^>]*>)৳/g, `<span ${spanClass}>৳</span>`);

            if (content !== fs.readFileSync(fullPath, 'utf8')) {
                fs.writeFileSync(fullPath, content);
                console.log("Updated", fullPath);
            }
        }
    }
}

wrapTaka('src');
wrapTaka('php_export');
console.log('Taka signs resized');

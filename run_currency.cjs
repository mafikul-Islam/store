const fs = require('fs');
const glob = require('glob');

function replaceCurrency(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (let dirent of files) {
        const fullPath = dir + '/' + dirent.name;
        if (dirent.isDirectory()) {
            if (dirent.name !== 'node_modules' && dirent.name !== '.git') {
                replaceCurrency(fullPath);
            }
        } else if (dirent.isFile() && (fullPath.endsWith('.php') || fullPath.endsWith('.tsx'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // In PHP:
            // $100 -> ৳100
            // $<?php -> ৳<?php
            if (fullPath.endsWith('.php')) {
                // look for literal '$' followed by digits
                content = content.replace(/\$([0-9])/g, '৳$1');
                
                // look for '$<?php' (followed by echo number_format usually)
                content = content.replace(/\$<\?php/g, '৳<?php');
                
                if (content !== fs.readFileSync(fullPath, 'utf8')) {
                    fs.writeFileSync(fullPath, content);
                    modified = true;
                }
            }
            
            if (fullPath.endsWith('.tsx')) {
                // In TSX JSX blocks:
                // >$100< -> >৳100<
                content = content.replace(/>\$([0-9]+)</g, '>৳$1<');
                
                // >${something}< -> >৳{something}<
                content = content.replace(/>\$\{([^}]+)\}</g, '>৳{$1}<');
                
                // >${something} -> >৳{something}
                content = content.replace(/>\s*\$\{([a-zA-Z0-9_.\(\)\*\s]+)\}/g, '>৳{$1}');

                // ">" could also be before text. 
                // Let's do a safer replace:
                // literal \$ followed by {product, order, cart, (item
                content = content.replace(/\$\{((?:product|order|cartTotal|item)[^}]+toFixed[^}]+)\}/g, '৳{$1}');
                
                if (content !== fs.readFileSync(fullPath, 'utf8')) {
                    fs.writeFileSync(fullPath, content);
                    modified = true;
                }
            }
        }
    }
}

replaceCurrency('src');
replaceCurrency('php_export');
console.log('Currency replaced');

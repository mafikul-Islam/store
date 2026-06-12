const fs = require('fs');

function cleanActive(dir) {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    
    for (let dirent of files) {
        const fullPath = dir + '/' + dirent.name;
        if (dirent.isDirectory()) {
            if (dirent.name !== 'node_modules' && dirent.name !== '.git') {
                cleanActive(fullPath);
            }
        } else if (dirent.isFile() && (fullPath.endsWith('.php') || fullPath.endsWith('.tsx'))) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let original = content;

            // Simple replace to remove if it's an input or div that we don't want
            // Let's just find <tag ... class="... active:scale-95"...>
            // actually easier: replace globally, then re-add to buttons using a better regex, or just manually remove from known bad ones.

            // The bad ones are: inputs, selects, labels, spans, divs.
            // Let's do a regex that finds `<TAG_NAME ` up to `>` 
            // If TAG_NAME isn't a, button, Link, we remove `active:scale-95`
            
            content = content.replace(/<([a-zA-Z0-9]+)([^>]+)active:scale-95([^>]*)>/g, (match, p1, p2, p3) => {
                const tag = p1.toLowerCase();
                const validTags = ['button', 'a', 'link'];
                if (!validTags.includes(tag)) {
                    // remove active:scale-95, preserving spaces
                    const newMatch = match.replace(/\s*active:scale-95\s*/g, ' ');
                    return newMatch.replace(/ "/g, '"').replace(/' "/g, "'\""); // cleanup any space before quote
                }
                return match;
            });

            // Need to handle multi-line tags (which [^>]+ captures as long as no >)
            // But what about the ones where it's at the very end of the class string? " active:scale-95" -> " "
            // The replace above will turn `class="foo active:scale-95"` into `class="foo "`.
            content = content.replace(/ class(Name)?="([^"]*?)\s+"/g, ' class$1="$2"');
            
            if (content !== original) {
                fs.writeFileSync(fullPath, content);
                console.log("Cleaned up", fullPath);
            }
        }
    }
}

cleanActive('src');
cleanActive('php_export');
console.log('Cleanup done');

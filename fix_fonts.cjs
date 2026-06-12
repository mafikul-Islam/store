const fs = require('fs');
const path = require('path');

const dir = 'php_export';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.php'));

const oldLink = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">';
const newLink = '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">';

const oldFont = "serif: ['Space Grotesk', 'ui-serif', 'Georgia', 'serif'],";
const newFont = "serif: ['Playfair Display', 'ui-serif', 'Georgia', 'Cambria', '\"Times New Roman\"', 'Times', 'serif'],";

files.forEach(file => {
    let filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');

    content = content.replace(oldLink, newLink);
    content = content.replace(oldFont, newFont);

    fs.writeFileSync(filepath, content);
});
console.log('Fonts updated in PHP files');

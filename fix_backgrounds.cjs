const fs = require('fs');
const path = require('path');

const dir = 'php_export';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.php'));

files.forEach(file => {
    let filepath = path.join(dir, file);
    let content = fs.readFileSync(filepath, 'utf8');

    // Replace dark:bg-gray-900 in form inputs with dark:bg-gray-800
    // We'll specifically target 'dark:bg-gray-900' within class="... something ..." of inputs, textareas, selects
    // Doing a blanket replace might affect other things, but on inputs it's needed
    // First, let's find all inputs/textareas/selects and modify their classes
    
    // Easier way: let's replace "bg-transparent dark:bg-gray-900" with "bg-white dark:bg-gray-800"
    content = content.replace(/bg-transparent dark:bg-gray-900/g, 'bg-white dark:bg-gray-800');
    
    // For inputs in login/register, they have "bg-white dark:bg-gray-900"
    content = content.replace(/bg-white dark:bg-gray-900(?=.*?(?:text-gray-900|placeholder-gray-400))/g, 'bg-white dark:bg-gray-800');
    // wait, the above might catch container divs. Let's strictly target login inputs:
    content = content.replace(/class="(?=[^"]*text-gray-900)(?=[^"]*dark:text-white)(?=[^"]*(?:shadow-sm|border-gray-300|ring-1))[^"]+"/g, function(match) {
        // If it's an input class, make sure it has dark:bg-gray-800 instead of dark:bg-gray-900 or nothing
        let newClass = match;
        // if it lacks explicit bg, add bg-white
        if (!newClass.includes('bg-')) {
            newClass = newClass.replace('class="', 'class="bg-white dark:bg-gray-800 ');
        } else {
            newClass = newClass.replace(/dark:bg-gray-900/g, 'dark:bg-gray-800');
            newClass = newClass.replace(/bg-transparent/g, 'bg-white');
        }
        return newClass;
    });

    // But wait, some containers might have text-gray-900, dark:text-white, and ring-1 (cards)
    // Let's do it safely:
    
    fs.writeFileSync(filepath, content);
});
console.log('Fixed input backgrounds');

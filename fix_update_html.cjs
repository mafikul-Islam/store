const fs = require('fs');
const path = require('path');

let f = 'php_export/update.php';
let content = fs.readFileSync(f, 'utf8');
const fileInputHtml = `
                    <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        <label for="image_file" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Or Upload from Device (Overrides URL)
                        </label>
                        <div class="mt-2 text-gray-900 dark:text-white">
                            <input 
                                type="file" 
                                id="image_file" 
                                name="image_file" 
                                accept="image/*"
                                class="block w-full text-sm text-gray-500 dark:text-gray-400
                                  file:mr-4 file:py-2 file:px-4
                                  file:rounded-full file:border-0
                                  file:text-sm file:font-semibold
                                  file:bg-black file:text-white dark:file:bg-white dark:file:text-black
                                  hover:file:bg-gray-800 dark:hover:file:bg-gray-200"
                            >
                        </div>
                    </div>`;

content = content.replace(/placeholder="https:\/\/\.\.\."\n(.*?)>\n(.*?)<\/div>/s, 'placeholder="https://..."\n$1>\n$2</div>\n' + fileInputHtml);
fs.writeFileSync(f, content);
console.log('done fixing update form html');

const fs = require('fs');

function getHtml(valueStr, imgSrcStr) {
    return `
                    <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-white mb-2">
                        Product Image
                    </label>
                    <div 
                        class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-700 px-6 py-10 bg-white dark:bg-gray-900 transition-colors"
                        id="drop-zone"
                        ondragover="event.preventDefault(); this.classList.add('border-black', 'dark:border-white', 'bg-gray-50', 'dark:bg-gray-800'); this.classList.remove('border-gray-900/25', 'dark:border-gray-700', 'bg-white', 'dark:bg-gray-900');"
                        ondragleave="event.preventDefault(); this.classList.remove('border-black', 'dark:border-white', 'bg-gray-50', 'dark:bg-gray-800'); this.classList.add('border-gray-900/25', 'dark:border-gray-700', 'bg-white', 'dark:bg-gray-900');"
                        ondrop="event.preventDefault(); this.classList.remove('border-black', 'dark:border-white', 'bg-gray-50', 'dark:bg-gray-800'); this.classList.add('border-gray-900/25', 'dark:border-gray-700', 'bg-white', 'dark:bg-gray-900'); document.getElementById('image_file').files = event.dataTransfer.files; previewImage(document.getElementById('image_file'));"
                    >
                        <div class="text-center w-full">
                            <div id="image-preview" class="\${imgSrcStr ? '' : 'hidden '}mx-auto flex justify-center w-full">
                                <img id="preview-img" src="\${imgSrcStr}" alt="Preview" class="h-64 object-cover rounded-md" />
                            </div>
                            <div id="upload-prompt" class="\${imgSrcStr ? 'hidden ' : ''}">
                                <i data-feather="image" class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"></i>
                                <div class="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                                    <label
                                        for="image_file"
                                        class="relative cursor-pointer rounded-md bg-transparent font-semibold text-black dark:text-white focus-within:outline-none hover:underline"
                                    >
                                        <span>Upload a file</span>
                                        <input id="image_file" name="image_file" type="file" class="sr-only" accept="image/*" onchange="previewImage(this)" />
                                    </label>
                                    <p class="pl-1">or drag and drop</p>
                                </div>
                                <p class="text-xs leading-5 text-gray-500">PNG, JPG, WebP up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <label for="image_url" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Or Image URL
                        </label>
                        <div class="mt-2">
                            <input
                                type="url"
                                id="image_url"
                                name="image_url"
                                \${valueStr}
                                class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
                                placeholder="https://..."
                                oninput="previewImageUrl(this.value)"
                            >
                        </div>
                    </div>
<script>
    function previewImage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('image-preview').classList.remove('hidden');
                document.getElementById('upload-prompt').classList.add('hidden');
                document.getElementById('preview-img').src = e.target.result;
                document.getElementById('image_url').value = ''; 
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function previewImageUrl(url) {
        if (url) {
            document.getElementById('image-preview').classList.remove('hidden');
            document.getElementById('upload-prompt').classList.add('hidden');
            document.getElementById('preview-img').src = url;
            document.getElementById('image_file').value = '';
        } else {
            document.getElementById('image-preview').classList.add('hidden');
            document.getElementById('upload-prompt').classList.remove('hidden');
            document.getElementById('preview-img').src = '';
        }
    }
</script>
`;
}

let fAdd = 'php_export/add.php';
let textAdd = fs.readFileSync(fAdd, 'utf8');
let matchStrAdd = /<div>\s*<label for="image_url"[^>]*>.*?(?=<div>\s*<label for="description")/s;
textAdd = textAdd.replace(matchStrAdd, "<div>\n" + getHtml('', '') + "</div>\n");
fs.writeFileSync(fAdd, textAdd);

let fUpdate = 'php_export/update.php';
let textUpd = fs.readFileSync(fUpdate, 'utf8');
let matchStrUpd = /<div>\s*<label for="image_url"[^>]*>.*?(?=<div>\s*<label for="description")/s;
textUpd = textUpd.replace(matchStrUpd, "<div>\n" + getHtml('value="<?php echo htmlspecialchars($product[\'image\']); ?>"', '<?php echo htmlspecialchars($product[\'image\']); ?>') + "</div>\n");
fs.writeFileSync(fUpdate, textUpd);

console.log('Fixed UI in both files');

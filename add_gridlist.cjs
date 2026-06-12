const fs = require('fs');

const file = 'php_export/products.php';
let text = fs.readFileSync(file, 'utf8');

const toggleHtml = `
 <div class="hidden sm:flex items-center gap-1 bg-white dark:bg-gray-800 rounded-full p-1 border border-gray-200 dark:border-gray-700 ml-4 shadow-sm">
 <button
 type="button"
 onclick="setViewMode('grid')"
 id="view-grid"
 class="p-1.5 rounded-full transition-colors bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
 aria-label="Grid view"
 >
 <i data-feather="grid" class="w-4 h-4"></i>
 </button>
 <button
 type="button"
 onclick="setViewMode('list')"
 id="view-list"
 class="p-1.5 rounded-full transition-colors text-gray-500 hover:text-black dark:hover:text-white"
 aria-label="List view"
 >
 <i data-feather="list" class="w-4 h-4"></i>
 </button>
 </div>
 </div>
 </form>
`;

text = text.replace(' </div>\n </form>', toggleHtml);

// id the container
text = text.replace(' <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">', ' <div id="product-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">');
text = text.replace(' <div class="group relative flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">', ' <div class="product-card group relative flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">');
text = text.replace(' <div class="aspect-square p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden relative">', ' <div class="product-image-container aspect-square p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden relative">');

// also adding line-clamp to price etc? Nah just toggle script

const scriptHtml = `
 <script>
 function setViewMode(mode) {
 const container = document.getElementById('product-container');
 const gridBtn = document.getElementById('view-grid');
 const listBtn = document.getElementById('view-list');
 const cards = document.querySelectorAll('.product-card');
 const imageContainers = document.querySelectorAll('.product-image-container');
 
 if (!container) return;
 
 if (mode === 'list') {
 container.className = 'flex flex-col gap-6 max-w-4xl mx-auto';
 
 gridBtn.className = 'p-1.5 rounded-full transition-colors text-gray-500 hover:text-black dark:hover:text-white';
 listBtn.className = 'p-1.5 rounded-full transition-colors bg-gray-100 dark:bg-gray-700 text-black dark:text-white';
 
 cards.forEach(card => card.className = 'product-card group relative flex flex-row h-48 sm:h-64 bg-white dark:bg-gray-900 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300');
 imageContainers.forEach(ic => ic.className = 'product-image-container w-48 sm:w-64 h-full flex-shrink-0 p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden relative');
 } else {
 container.className = 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8';
 
 gridBtn.className = 'p-1.5 rounded-full transition-colors bg-gray-100 dark:bg-gray-700 text-black dark:text-white';
 listBtn.className = 'p-1.5 rounded-full transition-colors text-gray-500 hover:text-black dark:hover:text-white';
 
 cards.forEach(card => card.className = 'product-card group relative flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300');
 imageContainers.forEach(ic => ic.className = 'product-image-container aspect-square p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden relative');
 }
 }
 </script>
 </body>
`;

text = text.replace(' </body>', scriptHtml);

fs.writeFileSync(file, text);
console.log('Fixed grid/list UI in products.php');

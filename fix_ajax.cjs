const fs = require('fs');

const toastHtml = `
<div id="toast-container" class="fixed bottom-4 right-4 z-50 flex flex-col gap-2"></div>
<style>
.toast-enter { animation: toastIn 0.3s ease-out forwards; }
.toast-exit { animation: toastOut 0.3s ease-in forwards; }
@keyframes toastIn { from { opacity: 0; transform: translateY(1rem); } to { opacity: 1; transform: translateY(0); } }
@keyframes toastOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(1rem); } }
</style>
<script>
function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 toast-enter';
    toast.innerHTML = '<i data-feather="check-circle" class="text-green-500 w-5 h-5"></i><span>' + message + '</span>';
    container.appendChild(toast);
    if(window.feather) feather.replace();
    
    setTimeout(() => {
        toast.classList.replace('toast-enter', 'toast-exit');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const addLinks = document.querySelectorAll('a[href^="cart.php?add="]');
    
    addLinks.forEach(link => {
        // We only want to intercept if it's "Add to Cart", not "Shop Now" (Shop Now should redirect)
        // Check text content or id
        const isShopNow = link.id === 'shopNowBtn' || link.textContent.includes('Shop Now');
        
        if (!isShopNow) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const btn = e.currentTarget;
                const originalText = btn.innerHTML;
                
                // Optional loading state
                // btn.style.opacity = '0.7';
                
                let url = btn.getAttribute('href');
                url = url.replace('cart.php', 'cart_add_ajax.php');
                
                fetch(url)
                    .then(res => res.json())
                    .then(data => {
                        // btn.style.opacity = '1';
                        if (data.success) {
                            showToast(data.name + ' added to cart!');
                        }
                    })
                    .catch(err => {
                        // btn.style.opacity = '1';
                    });
            });
        }
    });
});
</script>
</body>
`;

['php_export/index.php', 'php_export/products.php', 'php_export/product.php'].forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    if (!content.includes('toast-container')) {
        content = content.replace('</body>', toastHtml);
        fs.writeFileSync(file, content);
        console.log("Added toast to " + file);
    }
});

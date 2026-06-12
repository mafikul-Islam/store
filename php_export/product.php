<?php
session_start();
require_once 'db_connect.php';

if (!isset($_GET['id'])) {
 header("Location: products.php");
 exit;
}

$id = $_GET['id'];
$stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
$stmt->execute([$id]);
$product = $stmt->fetch();

if (!$product) {
 echo '<div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center">';
 echo '<p class="text-xl text-gray-500 dark:text-gray-400 mb-4">Product not found.</p>';
 echo '<a href="products.php" class="text-black dark:text-white hover:underline flex items-center gap-2">&larr; Return to Products</a>';
 echo '</div>';
 exit;
}

$isAuth = isset($_SESSION['user_id']);
$isAdmin = isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
$inStock = $product['stock'] > 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title><?php echo htmlspecialchars($product['name']); ?> - Mafikul's Store</title>
 
 <link rel="preconnect" href="https://fonts.googleapis.com">
 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
 <script src="https://cdn.tailwindcss.com"></script>
 <script>
 tailwind.config = {
 darkMode: 'class',
 theme: {
 extend: {
 fontFamily: {
 sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
 serif: ['Playfair Display', 'ui-serif', 'Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
 mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
 }
 }
 }
 }
 </script>
 <script src="https://unpkg.com/feather-icons"></script>
 <script>
 if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
 document.documentElement.classList.add('dark');
 } else {
 document.documentElement.classList.remove('dark');
 }
 </script>
 <style>
 body { font-family: 'Inter', sans-serif; }
 .font-serif { font-family: 'Playfair Display', serif; }
 .font-mono { font-family: 'JetBrains Mono', monospace; }
 
 .anim-word {
 display: inline-block;
 white-space: pre;
 opacity: 0;
 }
 </style>

</head>
<body class="min-h-screen bg-white  flex flex-col transition-colors duration-200 bg-gray-50 dark:bg-gray-950">

<div class="fixed inset-0 -z-50 overflow-hidden pointer-events-none transition-colors duration-300">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-gray-200/50 dark:from-gray-800/50 to-transparent blur-3xl opacity-50 dark:opacity-30 pointer-events-none"></div>
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-900/20 rounded-full blur-[100px] opacity-50 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-50 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
</div>


 <nav class="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md transition-colors duration-200">
 <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
 <div class="flex items-center gap-8">
 <a href="index.php" class="flex items-center gap-2 text-gray-900 dark:text-white">
 <i data-feather="package" class="h-6 w-6"></i>
 <span class="font-serif text-xl font-bold tracking-tight">Mafikul's Store</span>
 </a>
 <div class="hidden md:flex gap-6">
 <a href="index.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-white text-gray-500 dark:text-gray-400">Home</a>
 <a href="products.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-white text-black dark:text-white">Shop</a>
 </div>
 </div>

 <div class="flex items-center gap-4">
 <?php if($isAuth): ?>
 <?php if($isAdmin): ?>
 <a href="dashboard.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-white text-gray-500 dark:text-gray-400">
 Admin Dashboard
 </a>
 <div class="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden md:block"></div>
 <?php endif; ?>
 <div class="flex items-center gap-2">
 <span class="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline-block">Hi, <?php echo htmlspecialchars(explode(' ', $_SESSION['username'])[0]); ?></span>
 <a href="logout.php" class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors ml-2 sm:ml-0">
 <i data-feather="log-out" class="h-4 w-4"></i>
 <span class="hidden md:inline">Logout</span>
 </a>
 </div>
 <?php else: ?>
 <a href="login.php" class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
 <i data-feather="user" class="h-4 w-4"></i>
 <span class="hidden md:inline">Login</span>
 </a>
 <?php endif; ?>
 
 <div class="h-4 w-px bg-gray-200 mx-2 hidden md:block"></div>
 
 
 <!-- Dark Mode Toggle -->
 <button id="theme-toggle" type="button" class="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mr-4">
 <i data-feather="sun" class="h-4 w-4 hidden dark:inline"></i>
 <i data-feather="moon" class="h-4 w-4 inline dark:hidden"></i>
 </button>

 <a href="cart.php" class="flex items-center gap-2 text-gray-900 dark:text-white group relative">
 <i data-feather="shopping-cart" class="h-5 w-5 group-hover:scale-110 transition-transform"></i>
 </a>
 </div>
 </div>
 </nav>
 
 <main class="flex-1 py-12 pt-24">
 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <a href="products.php" class="inline-flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white mb-8 transition-colors">
 <i data-feather="arrow-left" class="mr-2 h-4 w-4"></i> Back to Products
 </a>

 <div class="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
 <!-- Product Image -->
 <div class="mb-10 lg:mb-0 flex justify-center lg:justify-start">
 <div class="w-full max-w-md aspect-square overflow-hidden rounded-3xl bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-sm relative group p-8 flex items-center justify-center">
 <img
 src="<?php echo htmlspecialchars($product['image']); ?>"
 alt="<?php echo htmlspecialchars($product['name']); ?>"
 class="h-full w-full object-contain object-center transition-transform duration-700 group-hover:scale-105"
 >
 </div>
 </div>

 <!-- Product Info -->
 <div class="flex flex-col justify-center">
 <div class="mb-6">
 <span class="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200 mb-4 tracking-wide uppercase">
 <?php echo htmlspecialchars($product['category'] ?: 'Uncategorized'); ?>
 </span>
 <h1 class="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
 <?php echo htmlspecialchars($product['name']); ?>
 </h1>
 <p class="text-3xl tracking-tight text-gray-900 dark:text-white font-medium">
 <span class="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span><?php echo number_format($product['price'], 2); ?>
 </p>
 </div>

 <div class="mb-8 border-t border-gray-100 dark:border-gray-800 pt-8">
 <h3 class="text-sm font-medium text-gray-900 dark:text-white mb-4">Description</h3>
 <div class="prose prose-sm text-gray-500 dark:text-gray-400">
 <?php echo nl2br(htmlspecialchars($product['description'] ?: "A premium quality product thoughtfully designed for modern lifestyles.")); ?>
 </div>
 </div>

 <div class="mb-10">
 <div class="flex items-center justify-between mb-4">
 <h3 class="text-sm font-medium text-gray-900 dark:text-white">Availability</h3>
 <span class="text-sm <?php echo $inStock ? 'text-green-600' : 'text-red-600'; ?>">
 <?php echo $inStock ? htmlspecialchars($product['stock']) . ' in stock' : 'Out of stock'; ?>
 </span>
 </div>
 
 <div class="flex items-center justify-between mb-4">
 <h3 class="text-sm font-medium text-gray-900 dark:text-white">Quantity</h3>
 <div class="flex items-center space-x-3">
 <button
 type="button" 
 id="decreaseQty"
 class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition <?php echo !$inStock ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''; ?> active:scale-95"
 >
 -
 </button>
 <span id="qtyDisplay" class="text-gray-900 dark:text-white font-medium w-4 text-center">1</span>
 <button
 type="button" 
 id="increaseQty"
 class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition <?php echo !$inStock ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''; ?> active:scale-95"
 >
 +
 </button>
 </div>
 </div>
 
 <div class="flex flex-col sm:flex-row gap-4">
 <a
 id="addToCartBtn"
 href="cart.php?add=<?php echo urlencode($product['id']); ?>&qty=1"
 class="flex-1 flex items-center justify-center gap-2 rounded-full bg-white dark:bg-gray-900 px-8 py-4 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 <?php echo !$inStock ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''; ?> active:scale-95"
 >
 <i data-feather="shopping-cart" class="h-4 w-4"></i>
 <?php echo $inStock ? "Add to Cart" : "Out of Stock"; ?>
 </a>
 <a
 id="shopNowBtn"
 href="cart.php?add=<?php echo urlencode($product['id']); ?>&qty=1"
 class="flex-1 flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-8 py-4 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-all duration-200 <?php echo !$inStock ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''; ?> active:scale-95"
 >
 <?php echo $inStock ? "Shop Now" : "Out of Stock"; ?>
 </a>
 </div>
 </div>

 <div class="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-gray-100 dark:border-gray-800">
 <div class="flex items-start gap-3">
 <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300">
 <i data-feather="truck" class="h-5 w-5"></i>
 </div>
 <div>
 <h4 class="text-sm font-medium text-gray-900 dark:text-white">Free Shipping</h4>
 <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">On orders over <span class="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span>100</p>
 </div>
 </div>
 <div class="flex items-start gap-3">
 <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300">
 <i data-feather="shield" class="h-5 w-5"></i>
 </div>
 <div>
 <h4 class="text-sm font-medium text-gray-900 dark:text-white">2 Year Warranty</h4>
 <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Full coverage</p>
 </div>
 </div>
 <div class="flex items-start gap-3">
 <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-300">
 <i data-feather="refresh-ccw" class="h-5 w-5"></i>
 </div>
 <div>
 <h4 class="text-sm font-medium text-gray-900 dark:text-white">Free Returns</h4>
 <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Within 30 days</p>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
 </main>

 <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6 mt-auto">
 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
 <p class="mt-2">&copy; <?php echo date('Y'); ?> Mafikul's Store. All rights reserved.</p>
 </div>
 </footer>

 
 <script>
 feather.replace();
 const themeToggleBtn = document.getElementById('theme-toggle');
 if (themeToggleBtn) {
 themeToggleBtn.addEventListener('click', function() {
 if (document.documentElement.classList.contains('dark')) {
 document.documentElement.classList.remove('dark');
 localStorage.setItem('theme', 'light');
 } else {
 document.documentElement.classList.add('dark');
 localStorage.setItem('theme', 'dark');
 }
 });
 }

 const decBtn = document.getElementById('decreaseQty');
 const incBtn = document.getElementById('increaseQty');
 const display = document.getElementById('qtyDisplay');
 const addBtn = document.getElementById('addToCartBtn');
 const shopBtn = document.getElementById('shopNowBtn');
 let currentQty = 1;
 const maxQty = <?php echo (int)($product['stock']); ?>;

 function updateLinks() {
 if (display) display.textContent = currentQty;
 if (addBtn) addBtn.href = addBtn.href.replace(/qty=\d+/, 'qty=' + currentQty);
 if (shopBtn) shopBtn.href = shopBtn.href.replace(/qty=\d+/, 'qty=' + currentQty);
 }

 if (decBtn) {
 decBtn.addEventListener('click', () => {
 if (currentQty > 1) {
 currentQty--;
 updateLinks();
 }
 });
 }

 if (incBtn) {
 incBtn.addEventListener('click', () => {
 if (currentQty < maxQty) {
 currentQty++;
 updateLinks();
 }
 });
 }
 </script>

 

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

</html>

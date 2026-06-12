<?php
session_start();
require_once 'db_connect.php';

// Fetch products
$stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
$products = $stmt->fetchAll();

$isAuth = isset($_SESSION['user_id']);
$isAdmin = isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
$userName = $isAuth ? explode(' ', $_SESSION['username'])[0] : '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Mafikul's Store</title>
 
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
<body class="min-h-screen   flex flex-col transition-colors duration-200 bg-gray-50 dark:bg-gray-950">

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
 <a href="index.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-gray-300 text-black dark:text-white">Home</a>
 <a href="products.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-gray-300 text-gray-500 dark:text-gray-400">Shop</a>
 </div>
 </div>

 <div class="flex items-center gap-4">
 <?php if($isAuth): ?>
 <?php if($isAdmin): ?>
 <a href="dashboard.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-gray-300 text-gray-500 dark:text-gray-400">
 Admin Dashboard
 </a>
 <div class="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden md:block"></div>
 <?php endif; ?>
 <div class="flex items-center gap-2">
 <span class="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline-block">Hi, <?php echo htmlspecialchars($userName); ?></span>
 <a href="logout.php" class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-2 sm:ml-0">
 <i data-feather="log-out" class="h-4 w-4"></i>
 <span class="hidden md:inline">Logout</span>
 </a>
 </div>
 <?php else: ?>
 <a href="login.php" class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-gray-300 transition-colors">
 <i data-feather="user" class="h-4 w-4"></i>
 <span class="hidden md:inline">Login</span>
 </a>
 <?php endif; ?>
 
 <div class="h-4 w-px bg-gray-200 dark:bg-gray-800 mx-2 hidden md:block"></div>
 
 
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
 
 <!-- Hero Section -->
 <section class="relative overflow-hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
 <!-- Live Background Effect -->
 <div class="absolute inset-0 overflow-hidden pointer-events-none">
 <div class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 opacity-50 z-0"></div>
 <div id="glow1" class="absolute w-[600px] h-[600px] rounded-full blur-[100px] z-0 opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none bg-blue-300 dark:bg-blue-600 transition-transform duration-1000 ease-out" style="transform: translate(-300px, -300px)"></div>
 <div id="glow2" class="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[80px] z-0 opacity-40 dark:opacity-20 mix-blend-multiply dark:mix-blend-screen pointer-events-none bg-purple-300 dark:bg-purple-600 transition-transform duration-1000 ease-out" style="transform: translate(0, 0)"></div>
 </div>

 <div class="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 flex flex-col items-center text-center">
 <span class="inline-flex items-center rounded-full bg-black/5 dark:bg-white/10 px-3 py-1 text-sm font-medium text-gray-900 dark:text-white ring-1 ring-inset ring-black/10 dark:ring-white/20 mb-8 backdrop-blur-sm">
 The Premium Experience
 </span>
 <h1 id="animated-title" class="font-serif text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl flex flex-wrap justify-center gap-x-3 sm:gap-x-4">
 <!-- Curated goods for a modern lifestyle -->
 </h1>
 <p class="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mb-10">
 Discover our handpicked collection of premium products, designed to elevate your everyday routines with uncompromised quality and aesthetics.
 </p>
 <div class="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
 <a href="products.php" class="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-8 py-3.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 hover:scale-105 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full sm:w-auto active:scale-95">
 Shop Collection
 </a>
 <a href="#featured" class="inline-flex items-center justify-center rounded-full bg-white dark:bg-gray-900 px-8 py-3.5 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:scale-105 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 w-full sm:w-auto backdrop-blur-sm active:scale-95">
 View Featured
 </a>
 </div>
 </div>
 </section>

 <!-- Trust Badges -->
 <section class="bg-white dark:bg-gray-900 py-12 border-b border-gray-100 dark:border-gray-800">
 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-gray-100 dark:divide-gray-800">
 <div class="flex flex-col items-center text-center px-4">
 <i data-feather="shield" class="h-8 w-8 text-black dark:text-white mb-4 stroke-1"></i>
 <h3 class="text-sm font-semibold text-gray-900 dark:text-white">100% Authentic</h3>
 <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Verified premium goods</p>
 </div>
 <div class="flex flex-col items-center text-center px-4">
 <i data-feather="truck" class="h-8 w-8 text-black dark:text-white mb-4 stroke-1"></i>
 <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Fast Shipping</h3>
 <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Express global delivery</p>
 </div>
 <div class="flex flex-col items-center text-center px-4">
 <i data-feather="lock" class="h-8 w-8 text-black dark:text-white mb-4 stroke-1"></i>
 <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Secure Payments</h3>
 <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">256-bit encrypted</p>
 </div>
 <div class="flex flex-col items-center text-center px-4">
 <i data-feather="refresh-ccw" class="h-8 w-8 text-black dark:text-white mb-4 stroke-1"></i>
 <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Easy Returns</h3>
 <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">30-day return policy</p>
 </div>
 </div>
 </div>
 </section>

 <!-- Featured Products -->
 <section id="featured" class="py-24 bg-gray-50 dark:bg-gray-950">
 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div class="flex items-end justify-between mb-12">
 <div>
 <h2 class="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Featured Releases</h2>
 <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">The latest additions to our curated catalog.</p>
 </div>
 <a href="products.php" class="group hidden md:flex items-center gap-2 text-sm font-medium text-black dark:text-white hover:opacity-70 transition-opacity">
 View All <i data-feather="arrow-right" class="h-4 w-4 group-hover:translate-x-1 transition-transform"></i>
 </a>
 </div>
 
 <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
 <?php 
 $featured = array_slice($products, 0, 4);
 foreach($featured as $product):
 $inStock = $product['stock'] > 0;
 ?>
 <div class="group relative flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl dark:hover:shadow-white/5 transition-all duration-300">
 <div class="aspect-[4/5] bg-gray-100 dark:bg-gray-800 overflow-hidden relative">
 <a href="product.php?id=<?php echo urlencode($product['id']); ?>" class="block h-full w-full">
 <img src="<?php echo htmlspecialchars($product['image']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" class="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105 <?php echo !$inStock ? 'opacity-50 grayscale' : ''; ?>">
 </a>
 <?php if(!$inStock): ?>
 <div class="absolute inset-0 flex items-center justify-center">
 <span class="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider">Out of Stock</span>
 </div>
 <?php endif; ?>
 </div>
 <div class="p-6 flex-1 flex flex-col">
 <h3 class="text-base font-semibold text-gray-900 dark:text-white line-clamp-1">
 <a href="product.php?id=<?php echo urlencode($product['id']); ?>" class="hover:underline">
 <?php echo htmlspecialchars($product['name']); ?>
 </a>
 </h3>
 <div class="mt-1">
 <span class="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-0.5 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-white/10 border border-gray-100 dark:border-gray-700">
 <?php echo htmlspecialchars($product['category'] ?: 'Uncategorized'); ?>
 </span>
 </div>
 <div class="mt-2 flex items-center justify-between">
 <p class="text-sm font-medium text-gray-500 dark:text-gray-400"><span class="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span><?php echo number_format($product['price'], 2); ?></p>
 </div>
 <div class="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
 <a href="cart.php?add=<?php echo urlencode($product['id']); ?>" class="w-full flex justify-center items-center gap-2 rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 <?php if(!$inStock) echo 'opacity-50 cursor-not-allowed pointer-events-none'; ?> transition-colors active:scale-95">
 <?php echo $inStock ? "Shop Now" : "Out of Stock"; ?>
 </a>
 </div>
 </div>
 </div>
 <?php endforeach; ?>
 </div>
 <div class="mt-12 flex justify-center md:hidden">
 <a href="products.php" class="inline-flex items-center justify-center rounded-full bg-white dark:bg-gray-900 px-8 py-3 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors w-full active:scale-95">
 View All Products
 </a>
 </div>
 </div>
 </section>

 <!-- Newsletter -->
 <section class="bg-black py-24 mt-auto">
 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
 <h2 class="font-serif text-3xl font-bold tracking-tight text-white mb-4">Join the Club</h2>
 <p class="max-w-xl mx-auto text-gray-400 mb-8">
 Subscribe to our newsletter to receive exclusive offers, early access to new releases, and curated editorial content.
 </p>
 <form class="mx-auto max-w-md flex gap-x-4" onsubmit="event.preventDefault()">
 <label for="email-address" class="sr-only">Email address</label>
 <input id="email-address" name="email" type="email" autocomplete="email" required class="min-w-0 flex-auto rounded-full border-0 bg-white/5 px-6 py-3.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-white sm:text-sm sm:leading-6 placeholder:text-gray-500" placeholder="Enter your email">
 <button type="submit" class="flex-none rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-black shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors active:scale-95">
 Subscribe
 </button>
 </form>
 </div>
 </section>

 <!-- Footer -->
 <footer class="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-6">
 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
 <div class="w-full flex flex-col md:flex-row justify-between items-center gap-4">
 <p>&copy; <?php echo date('Y'); ?> Mafikul's Store. All rights reserved.</p>
 <div class="flex gap-6">
 <a href="#" class="hover:text-black dark:hover:text-white transition-colors">Terms of Service</a>
 <a href="#" class="hover:text-black dark:hover:text-white transition-colors">Privacy Policy</a>
 </div>
 </div>
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

 // Mouse tracking for live background glow
 const glow1 = document.getElementById('glow1');
 const glow2 = document.getElementById('glow2');
 
 window.addEventListener('mousemove', (e) => {
 const x = e.clientX;
 const y = e.clientY;
 
 glow1.style.transform = `translate(${x - 300}px, ${y - 300}px)`;
 glow2.style.transform = `translate(${-(x / 4)}px, ${-(y / 4)}px)`;
 });

 // Animated Title Word Sequence
 const titleText = "Curated goods for a modern lifestyle";
 const titleWords = titleText.split(" ");
 const titleEl = document.getElementById('animated-title');
 titleEl.innerHTML = ''; // clear initial content
 
 titleWords.forEach((word, i) => {
 const span = document.createElement('span');
 span.textContent = word + (i < titleWords.length - 1 ? ' ' : '');
 span.className = 'anim-word';
 titleEl.appendChild(span);
 
 
 span.animate([
 { opacity: 0, transform: 'translateY(8px)', offset: 0 },
 { opacity: 0, transform: 'translateY(8px)', offset: (i * 0.1) || 0.001 },
 { opacity: 1, transform: 'translateY(0)', offset: (i * 0.1) + 0.05 },
 { opacity: 1, transform: 'translateY(0)', offset: 0.8 },
 { opacity: 0, transform: 'translateY(0)', offset: 1 }
 ], {
 duration: 6000,
 iterations: Infinity,
 easing: 'ease-out'
 });
        });
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

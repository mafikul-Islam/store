<?php
session_start();
require_once 'db_connect.php';

$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$category = isset($_GET['category']) ? $_GET['category'] : 'All';
$sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest';

$isAuth = isset($_SESSION['user_id']);
$isAdmin = isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';

// Get categories for filter
$catStmt = $pdo->query("SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != ''");
$allCategories = $catStmt->fetchAll(PDO::FETCH_COLUMN);

// Build query
$query = "SELECT * FROM products WHERE 1=1";
$params = [];

if ($search !== '') {
 $query .= " AND name LIKE ?";
 $params[] = "%$search%";
}

if ($category !== 'All') {
 $query .= " AND category = ?";
 $params[] = $category;
}

switch ($sort) {
 case 'price-low':
 $query .= " ORDER BY price ASC";
 break;
 case 'price-high':
 $query .= " ORDER BY price DESC";
 break;
 case 'name':
 $query .= " ORDER BY name ASC";
 break;
 case 'newest':
 default:
 $query .= " ORDER BY created_at DESC";
 break;
}

$stmt = $pdo->prepare($query);
$stmt->execute($params);
$products = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Products - Mafikul's Store</title>
 
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
 <a href="index.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-gray-300 text-gray-500 dark:text-gray-400">Home</a>
 <a href="products.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-gray-300 text-black dark:text-white">Shop</a>
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
 <span class="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline-block">Hi, <?php echo htmlspecialchars(explode(' ', $_SESSION['username'])[0]); ?></span>
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
 
 <main class="flex-1">
 <div class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-16">
 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
 <h1 class="font-serif text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">Complete Collection</h1>
 <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
 Browse our full catalog of premium goods. Thoughtfully designed and masterfully crafted.
 </p>
 </div>
 </div>

 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
 <form method="GET" action="products.php" class="flex flex-col md:flex-row gap-6 justify-between items-center mb-12">
 <div class="relative w-full md:max-w-md">
 <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
 <i data-feather="search" class="h-5 w-5 text-gray-400"></i>
 </div>
 <input
 type="text"
 name="search"
 class="block w-full rounded-full border-0 py-3 pl-11 px-6 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
 placeholder="Search products by name..."
 value="<?php echo htmlspecialchars($search); ?>"
 >
 </div>
 
 <div class="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
 <select
 name="category"
 onchange="this.form.submit()"
 class="block w-full sm:w-40 rounded-full border-0 py-2.5 px-4 pr-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
 >
 <option value="All" <?php if($category === 'All') echo 'selected'; ?>>All</option>
 <?php foreach($allCategories as $cat): ?>
 <option value="<?php echo htmlspecialchars($cat); ?>" <?php if($category === $cat) echo 'selected'; ?>><?php echo htmlspecialchars($cat); ?></option>
 <?php endforeach; ?>
 </select>

 <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap sr-only sm:not-sr-only">
 <i data-feather="sliders" class="h-4 w-4"></i>
 <span>Sort by:</span>
 </div>
 <select
 name="sort"
 onchange="this.form.submit()"
 class="block w-full sm:w-48 rounded-full border-0 py-2.5 px-4 pr-10 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
 >
 <option value="newest" <?php if($sort === 'newest') echo 'selected'; ?>>Newest Arrivals</option>
 <option value="price-low" <?php if($sort === 'price-low') echo 'selected'; ?>>Price: Low to High</option>
 <option value="price-high" <?php if($sort === 'price-high') echo 'selected'; ?>>Price: High to Low</option>
 <option value="name" <?php if($sort === 'name') echo 'selected'; ?>>Name: A to Z</option>
 </select>

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


 <?php if($isAdmin): ?>
 <div class="mb-8 flex justify-end">
 <a href="add.php" class="inline-flex items-center gap-2 rounded-full bg-black dark:bg-white px-6 py-2.5 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors shadow-sm active:scale-95">
 <i data-feather="plus" class="h-4 w-4"></i>
 Post New Product
 </a>
 </div>
 <?php endif; ?>

 <?php if(count($products) > 0): ?>
 <div id="product-container" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
 <?php foreach($products as $product):
 $inStock = $product['stock'] > 0;
 ?>
 <div class="product-card group relative flex flex-col bg-white dark:bg-gray-900 overflow-hidden rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-all duration-300">
 <div class="product-image-container aspect-square p-6 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden relative">
 <a href="product.php?id=<?php echo urlencode($product['id']); ?>" class="block h-full w-full">
 <img src="<?php echo htmlspecialchars($product['image']); ?>" alt="<?php echo htmlspecialchars($product['name']); ?>" class="h-full w-full object-contain object-center transition-transform duration-700 group-hover:scale-105 <?php echo !$inStock ? 'opacity-50 grayscale' : ''; ?>">
 </a>
 <?php if(!$inStock): ?>
 <div class="absolute inset-0 flex items-center justify-center">
 <span class="bg-black/90 dark:bg-white/90 backdrop-blur-sm text-white dark:text-black px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">Sold Out</span>
 </div>
 <?php endif; ?>
 </div>
 <div class="p-4 md:p-6 flex-1 flex flex-col justify-between">
 <div>
 <div class="flex justify-between items-start gap-4 mb-2">
 <h3 class="text-base font-semibold text-gray-900 dark:text-white leading-tight line-clamp-2">
 <a href="product.php?id=<?php echo urlencode($product['id']); ?>" class="hover:underline">
 <?php echo htmlspecialchars($product['name']); ?>
 </a>
 </h3>
 <p class="font-medium text-gray-900 dark:text-white text-base"><span class="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span><?php echo number_format($product['price'], 2); ?></p>
 </div>
 <div class="mb-2">
 <span class="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 dark:ring-white/10">
 <?php echo htmlspecialchars($product['category'] ?: 'Uncategorized'); ?>
 </span>
 </div>
 </div>
 
 <div class="mt-auto pt-4 flex flex-col gap-3 justify-end h-full">
 <p class="text-xs text-gray-500 dark:text-gray-400">Stock: <?php echo htmlspecialchars($product['stock']); ?> units</p>
 <div class="flex flex-col gap-3 mt-1">
 <a href="cart.php?add=<?php echo urlencode($product['id']); ?>" class="w-full flex justify-center items-center gap-2 rounded-full bg-black dark:bg-white px-4 py-2 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 <?php if(!$inStock) echo 'opacity-50 cursor-not-allowed pointer-events-none'; ?> transition-colors active:scale-95">
 <?php echo $inStock ? "Shop Now" : "Out of Stock"; ?>
 </a>

 <?php if($isAdmin): ?>
 <div class="flex items-center gap-2 w-full sm:w-auto">
 <a href="update.php?id=<?php echo urlencode($product['id']); ?>" class="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gray-50 dark:bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700 active:scale-95">
 <i data-feather="edit-2" class="h-4 w-4"></i>
 <span>Edit</span>
 </a>
 <form action="delete.php" method="POST" class="inline" onsubmit="return confirm('Delete this product?');">
 <input type="hidden" name="id" value="<?php echo htmlspecialchars($product['id']); ?>">
 <button type="submit" class="inline-flex items-center justify-center rounded-full bg-red-50 dark:bg-red-900/20 p-2 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors">
 <i data-feather="trash-2" class="h-4 w-4"></i>
 </button>
 </form>
 </div>
 <?php endif; ?>
 </div>
 </div>
 </div>
 </div>
 <?php endforeach; ?>
 </div>
 <?php else: ?>
 <div class="text-center py-32 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-300 dark:border-gray-800">
 <i data-feather="search" class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 dark:text-gray-300 mb-4"></i>
 <h3 class="text-sm font-semibold text-gray-900 dark:text-white">No products found</h3>
 <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">We couldn't find anything matching your search.</p>
 <a href="products.php" class="mt-6 inline-flex items-center rounded-full   px-4 py-2 text-sm font-semibold text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors active:scale-95">
 Clear search
 </a>
 </div>
 <?php endif; ?>
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

<?php
session_start();
require_once 'db_connect.php';

// Handle adding to cart
if (isset($_GET['add'])) {
 $id = $_GET['add'];
 $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
 $stmt->execute([$id]);
 $product = $stmt->fetch();
 
 if ($product) {
 if (!isset($_SESSION['cart'])) {
 $_SESSION['cart'] = [];
 }
 
 // Add or increment
 $qty = isset($_GET['qty']) ? (int)$_GET['qty'] : 1;
 if (isset($_SESSION['cart'][$id])) {
 $_SESSION['cart'][$id]['quantity'] += $qty;
 } else {
 $_SESSION['cart'][$id] = [
 'product' => $product,
 'quantity' => $qty
 ];
 }
 }
 header("Location: cart.php");
 exit;
}

// Handle removing from cart
if (isset($_GET['remove'])) {
 $id = $_GET['remove'];
 if (isset($_SESSION['cart'][$id])) {
 unset($_SESSION['cart'][$id]);
 }
 header("Location: cart.php");
 exit;
}

$cart = isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
$total = 0;
foreach ($cart as $item) {
 // Refresh product details from db just in case
 $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
 $stmt->execute([$item['product']['id']]);
 $dbProd = $stmt->fetch();
 
 if($dbProd) {
 $total += $dbProd['price'] * $item['quantity'];
 }
}

$isAuth = isset($_SESSION['user_id']);
$isAdmin = isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Cart - Mafikul's Store</title>
 
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
 <a href="index.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-white text-gray-500 dark:text-gray-400">Home</a>
 <a href="products.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-white text-gray-500 dark:text-gray-400">Shop</a>
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
 <?php if(count($cart) > 0): ?>
 <span class="absolute -top-2 -right-2 bg-red-500 text-white dark:text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full"><?php echo count($cart); ?></span>
 <?php endif; ?>
 </a>
 </div>
 </div>
 </nav>
 
 <main class="flex-1 py-12">
 <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
 <h1 class="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>
 
 <?php if(count($cart) === 0): ?>
 <div class="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
 <p class="text-gray-500 dark:text-gray-400 mb-6">Your cart is currently empty.</p>
 <a href="products.php" class="inline-flex items-center justify-center rounded-full bg-black dark:bg-white px-8 py-3 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors active:scale-95">
 Browse Products
 </a>
 </div>
 <?php else: ?>
 <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8">
 <div class="flow-root">
 <ul class="-my-6 divide-y divide-gray-200">
 <?php foreach($cart as $id => $item): 
 $p = $item['product'];
 ?>
 <li class="flex py-6">
 <div class="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-800">
 <img src="<?php echo htmlspecialchars($p['image']); ?>" alt="" class="h-full w-full object-cover object-center">
 </div>

 <div class="ml-4 flex flex-1 flex-col">
 <div>
 <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white">
 <h3>
 <a href="product.php?id=<?php echo urlencode($p['id']); ?>" class="hover:underline"><?php echo htmlspecialchars($p['name']); ?></a>
 </h3>
 <p class="ml-4"><span class="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span><?php echo number_format($p['price'] * $item['quantity'], 2); ?></p>
 </div>
 <p class="mt-1 text-sm text-gray-500 dark:text-gray-400"><?php echo htmlspecialchars($p['category']); ?></p>
 </div>
 <div class="flex flex-1 items-end justify-between text-sm">
 <p class="text-gray-500 dark:text-gray-400">Qty <?php echo htmlspecialchars($item['quantity']); ?></p>

 <div class="flex">
 <a href="cart.php?remove=<?php echo urlencode($p['id']); ?>" class="font-medium text-red-600 hover:text-red-500 flex items-center gap-1">
 <i data-feather="trash-2" class="h-4 w-4"></i> Remove
 </a>
 </div>
 </div>
 </div>
 </li>
 <?php endforeach; ?>
 </ul>
 </div>
 
 <div class="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8">
 <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
 <p>Subtotal</p>
 <p><span class="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span><?php echo number_format($total, 2); ?></p>
 </div>
 <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">Shipping and taxes calculated at checkout.</p>
 <div class="mt-6 flex gap-4">
 <a href="checkout.php" class="flex-1 flex items-center justify-center gap-2 rounded-full bg-black dark:bg-white px-6 py-4 text-base font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors active:scale-95">
 Checkout <i data-feather="arrow-right" class="h-5 w-5"></i>
 </a>
 </div>
 </div>
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

 
</body>
</html>

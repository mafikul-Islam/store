<?php
session_start();
require_once 'db_connect.php';

// Auth check
if (!isset($_SESSION['user_id'])) {
 header("Location: login.php");
 exit;
}

$cart = isset($_SESSION['cart']) ? $_SESSION['cart'] : [];

if (count($cart) === 0) {
 header("Location: products.php");
 exit;
}

$total = 0;
foreach ($cart as $item) {
 $stmt = $pdo->prepare("SELECT price FROM products WHERE id = ?");
 $stmt->execute([$item['product']['id']]);
 $price = $stmt->fetchColumn();
 if($price !== false) {
 $total += $price * $item['quantity'];
 }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
 // Process order
 $orderId = 'ord_' . bin2hex(random_bytes(8));
 $stmt = $pdo->prepare("INSERT INTO orders (id, user_id, total, status) VALUES (?, ?, ?, 'pending')");
 $stmt->execute([$orderId, $_SESSION['user_id'], $total]);
 
 $_SESSION['cart'] = [];
 header("Location: checkout.php?success=1");
 exit;
}

$isAuth = isset($_SESSION['user_id']);
$isAdmin = isset($_SESSION['user_role']) && $_SESSION['user_role'] === 'admin';
$isSuccess = isset($_GET['success']);
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Checkout - Mafikul's Store</title>
 
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
 <?php if(!$isSuccess && count($cart) > 0): ?>
 <span class="absolute -top-2 -right-2 bg-red-500 text-white dark:text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full"><?php echo count($cart); ?></span>
 <?php endif; ?>
 </a>
 </div>
 </div>
 </nav>
 
 <?php if($isSuccess): ?>
 <main class="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
 <div class="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-3xl border border-gray-100 dark:border-gray-800 text-center shadow-lg">
 <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-6">
 <i data-feather="check-circle" class="h-8 w-8 text-green-600"></i>
 </div>
 <h2 class="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-2">Order Confirmed!</h2>
 <p class="text-gray-500 dark:text-gray-400 mb-8">Thank you for your purchase. We've received your order and will process it shortly.</p>
 <a href="index.php" class="inline-flex w-full items-center justify-center rounded-full bg-black dark:bg-white px-6 py-3 text-sm font-semibold text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors active:scale-95">
 Return Home
 </a>
 </div>
 </main>
 <?php else: ?>
 <main class="flex-1 py-12">
 <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
 <h1 class="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
 
 <div class="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
 <form action="checkout.php" method="POST" class="space-y-6">
 <div>
 <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Shipping Information</h2>
 <div class="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
 <div class="sm:col-span-2">
 <label for="name" class="block text-sm font-medium text-gray-900 dark:text-white">Full Name</label>
 <input required type="text" id="name" name="name" value="<?php echo htmlspecialchars($_SESSION['name'] ?? $_SESSION['username'] ?? ''); ?>" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700   text-gray-900 dark:text-white shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border bg-white dark:bg-gray-800">
 </div>
 <div class="sm:col-span-2">
 <label for="address" class="block text-sm font-medium text-gray-900 dark:text-white">Address</label>
 <input required type="text" id="address" name="address" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700   text-gray-900 dark:text-white shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border bg-white dark:bg-gray-800">
 </div>
 <div>
 <label for="city" class="block text-sm font-medium text-gray-900 dark:text-white">City</label>
 <input required type="text" id="city" name="city" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700   text-gray-900 dark:text-white shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border bg-white dark:bg-gray-800">
 </div>
 <div>
 <label for="zip" class="block text-sm font-medium text-gray-900 dark:text-white">ZIP / Postal Code</label>
 <input required type="text" id="zip" name="zip" class="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700   text-gray-900 dark:text-white shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border bg-white dark:bg-gray-800">
 </div>
 </div>
 </div>
 
 <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
 <h2 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Payment</h2>
 <div class="rounded-md bg-gray-50 dark:bg-gray-950 p-4 border border-gray-200 dark:border-gray-800 mb-4">
 <p class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
 <i data-feather="alert-circle" class="h-4 w-4"></i>
 This is a demo store. No actual payment is required.
 </p>
 </div>
 </div>

 <div class="border-t border-gray-200 dark:border-gray-800 pt-6">
 <div class="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-6">
 <p>Total to Pay</p>
 <p><span class="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span><?php echo number_format($total, 2); ?></p>
 </div>
 <button type="submit" class="w-full flex justify-center rounded-full bg-black dark:bg-white px-4 py-3 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors active:scale-95">
 Place Order
 </button>
 </div>
 </form>
 </div>
 </div>
 </main>
 <?php endif; ?>

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

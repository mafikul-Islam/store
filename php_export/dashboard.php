<?php
session_start();
require_once 'db_connect.php';

// Auth check
if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
 header("Location: index.php");
 exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && $_POST['action'] === 'save_inline') {
 $id = $_POST['id'];
 $price = floatval($_POST['price']);
 $stock = intval($_POST['stock']);
 $stmt = $pdo->prepare("UPDATE products SET price = ?, stock = ? WHERE id = ?");
 $stmt->execute([$price, $stock, $id]);
 header("Location: dashboard.php?msg=updated");
 exit;
}

// Fetch products
$stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
$products = $stmt->fetchAll();
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Admin Dashboard - Mafikul's Store</title>
 
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
 <a href="dashboard.php" class="text-sm font-medium transition-colors hover:text-black dark:hover:text-white text-black dark:text-white">
 Admin Dashboard
 </a>
 <div class="flex items-center gap-2">
 <span class="text-sm font-medium text-gray-900 dark:text-white hidden sm:inline-block">Hi, <?php echo htmlspecialchars(explode(' ', $_SESSION['username'])[0]); ?></span>
 <a href="logout.php" class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 transition-colors ml-2 sm:ml-0">
 <i data-feather="log-out" class="h-4 w-4"></i>
 <span class="hidden md:inline">Logout</span>
 </a>
 </div>
 
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

 <?php if(isset($_GET['msg']) && $_GET['msg'] === 'updated'): ?>
 <div class="fixed top-4 right-4 bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl shadow-lg z-50 text-sm font-medium">
 Product updated successfully!
 </div>
 <script>setTimeout(() => document.querySelector('.fixed.top-4').remove(), 3000);</script>
 <?php endif; ?>

 <main class="flex-1 py-12">
 <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
 <div class="border-b border-gray-200 dark:border-gray-800 mb-8">
 <nav class="-mb-px flex space-x-8" aria-label="Tabs">
 <a href="dashboard.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-black dark:border-white text-black dark:text-white relative top-[1px]">
 Inventory
 </a>
 <a href="orders.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:border-gray-700 hover:text-gray-700">
 Orders
 </a>
 </nav>
 </div>

 <div class="sm:flex sm:items-center">
 <div class="sm:flex-auto">
 <h1 class="text-2xl font-bold font-serif leading-6 text-gray-900 dark:text-white">Inventory Management</h1>
 <p class="mt-2 text-sm text-gray-700">
 A complete list of all products in your store including their name, price, stock, and category.
 </p>
 </div>
 <div class="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
 <a href="add.php" class="inline-flex items-center gap-2 rounded-md bg-black dark:bg-white px-3 py-2 text-center text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 active:scale-95">
 <i data-feather="plus" class="h-4 w-4"></i>
 Add product
 </a>
 </div>
 </div>
 
 <div class="mt-8 flow-root">
 <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
 <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
 <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
 <table class="min-w-full divide-y divide-gray-300">
 <thead class="bg-gray-50 dark:bg-gray-950">
 <tr>
 <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">
 ID & Product
 </th>
 <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
 Category
 </th>
 <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
 Price (USD)
 </th>
 <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
 Stock
 </th>
 <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
 <span class="sr-only">Actions</span>
 </th>
 </tr>
 </thead>
 <tbody class="divide-y divide-gray-200 bg-white dark:bg-gray-900">
 <?php foreach($products as $product): ?>
 <tr>
 <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
 <div class="flex items-center">
 <div class="h-10 w-10 flex-shrink-0">
 <img class="h-10 w-10 rounded-md object-cover ring-1 ring-gray-900/10" src="<?php echo htmlspecialchars($product['image']); ?>" alt="">
 </div>
 <div class="ml-4">
 <div class="font-medium text-gray-900 dark:text-white">
 <a href="update.php?id=<?php echo urlencode($product['id']); ?>" class="hover:underline"><?php echo htmlspecialchars($product['name']); ?></a>
 </div>
 <div class="text-gray-500 dark:text-gray-400">ID: <?php echo htmlspecialchars($product['id']); ?></div>
 </div>
 </div>
 </td>
 <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
 <span class="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-950 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10 border border-gray-200 dark:border-gray-800">
 <?php echo htmlspecialchars($product['category'] ?: 'Uncategorized'); ?>
 </span>
 </td>
 <form method="POST" action="dashboard.php" class="contents">
 <input type="hidden" name="action" value="save_inline">
 <input type="hidden" name="id" value="<?php echo htmlspecialchars($product['id']); ?>">
 <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
 <input 
 type="number" 
 step="0.01"
 name="price"
 value="<?php echo htmlspecialchars($product['price']); ?>"
 class="block w-24 rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800 active:scale-95"
 >
 </td>
 <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
 <input 
 type="number" 
 name="stock"
 value="<?php echo htmlspecialchars($product['stock']); ?>"
 class="block w-20 rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800 active:scale-95"
 >
 </td>
 <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
 <div class="flex items-center justify-end gap-4">
 <button type="submit" class="text-black dark:text-white hover:text-gray-600 dark:text-gray-300 font-semibold">
 Save
 </button>
 <a href="update.php?id=<?php echo urlencode($product['id']); ?>" class="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:text-white">
 <i data-feather="edit-2" class="h-4 w-4"></i>
 <span class="sr-only">Edit</span>
 </a>
 </form>
 <form method="POST" action="delete.php" class="inline" onsubmit="return confirm('Delete this product?');">
 <input type="hidden" name="id" value="<?php echo htmlspecialchars($product['id']); ?>">
 <button type="submit" class="text-red-500 hover:text-red-700">
 <i data-feather="trash-2" class="h-4 w-4"></i>
 <span class="sr-only">Delete</span>
 </button>
 </form>
 </div>
 </td>
 </tr>
 <?php endforeach; ?>
 </tbody>
 </table>
 </div>
 </div>
 </div>
 </div>
 </div>
 </main>

 
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

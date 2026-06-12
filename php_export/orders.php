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
$stmt = $pdo->query("SELECT orders.*, users.name as userName FROM orders JOIN users ON orders.user_id = users.id ORDER BY created_at DESC");
$orders = $stmt->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && isset($_POST['order_id'])) {
    $orderId = $_POST['order_id'];
    $newStatus = $_POST['status'];
    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$newStatus, $orderId]);
    header("Location: orders.php");
    exit;
}
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
 <a href="dashboard.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:border-gray-700 hover:text-gray-700">
 Inventory
 </a>
 <a href="orders.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-black dark:border-white text-black dark:text-white relative top-[1px]">
 Orders
 </a>
 </nav>
 </div>

 
                    <div class="sm:flex sm:items-center">
                        <div class="sm:flex-auto">
                            <h1 class="text-2xl font-bold font-serif leading-6 text-gray-900 dark:text-white">Customer Orders</h1>
                            <p class="mt-2 text-sm text-gray-700 dark:text-gray-400">
                                View and manage customer orders and their current status.
                            </p>
                        </div>
                    </div>
                    
                    <div class="mt-8 flow-root">
                        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                            <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-white/10 sm:rounded-lg">
                                    <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-800">
                                        <thead class="bg-gray-50 dark:bg-gray-900">
                                            <tr>
                                                <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6">Order ID</th>
                                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Customer</th>
                                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Total</th>
                                                <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900">
                                            <?php if(count($orders) === 0): ?>
                                            <tr>
                                                <td colspan="5" class="whitespace-nowrap py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                                                    No orders found.
                                                </td>
                                            </tr>
                                            <?php else: ?>
                                            <?php foreach($orders as $order): ?>
                                            <tr>
                                                <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                                                    #<?php echo htmlspecialchars(substr($order['id'], 0, 10)); ?>
                                                </td>
                                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <?php echo htmlspecialchars($order['userName']); ?>
                                                </td>
                                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    <?php echo date('M d, Y', strtotime($order['created_at'])); ?>
                                                </td>
                                                <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-900 dark:text-white font-medium">
                                                    <span class="text-[1.2em] font-medium mr-[1px] inline-block -translate-y-[0.05em]">৳</span><?php echo number_format($order['total'], 2); ?>
                                                </td>
                                                <td class="whitespace-nowrap px-3 py-4 text-sm relative">
                                                    <form method="POST" action="orders.php" style="margin:0;">
                                                        <input type="hidden" name="action" value="update_status">
                                                        <input type="hidden" name="order_id" value="<?php echo htmlspecialchars($order['id']); ?>">
                                                        <select name="status" onchange="this.form.submit()" class="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 dark:text-white dark:bg-gray-800 ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-black sm:text-sm sm:leading-6">
                                                            <option value="pending" <?php echo $order['status'] === 'pending' ? 'selected' : ''; ?>>Pending</option>
                                                            <option value="shipped" <?php echo $order['status'] === 'shipped' ? 'selected' : ''; ?>>Shipped</option>
                                                            <option value="delivered" <?php echo $order['status'] === 'delivered' ? 'selected' : ''; ?>>Delivered</option>
                                                        </select>
                                                    </form>
                                                </td>
                                            </tr>
                                            <?php endforeach; ?>
                                            <?php endif; ?>
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

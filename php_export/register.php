<?php
session_start();
require_once 'db_connect.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
 $name = trim($_POST['name']);
 $username = trim($_POST['username']);
 $email = trim($_POST['email']);
 $password = $_POST['password'];
 $error = '';

 if (empty($username) || empty($password) || empty($email)) {
 $error = "Please fill all fields.";
 } else {
 try {
  $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)");
  $stmt->execute([$name, $username, $email, $password]);
 header("Location: login.php");
 exit;
 } catch(PDOException $e) {
 $error = "Username or email already exists.";
 }
 }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Register - Mafikul's Store</title>
 
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
 <a href="login.php" class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
 <i data-feather="user" class="h-4 w-4"></i>
 <span class="hidden md:inline">Login</span>
 </a>
 
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
 
 <main class="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
 <div class="sm:mx-auto sm:w-full sm:max-w-md">
 <div class="mx-auto h-12 w-12 bg-black dark:bg-white rounded-xl flex items-center justify-center">
 <i data-feather="user" class="h-6 w-6 text-white dark:text-black"></i>
 </div>
 <h2 class="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
 Create an account
 </h2>
 <p class="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
 Already have an account? <a href="login.php" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 underline">Sign in</a>
 </p>
 </div>

 <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
 <div class="bg-white dark:bg-gray-900 px-6 py-12 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/5 sm:rounded-xl sm:px-12">
 <?php if(!empty($error)): ?>
 <div class="rounded-md bg-red-50 p-4 mb-6">
 <div class="flex">
 <div class="ml-3">
 <h3 class="text-sm font-medium text-red-800"><?php echo htmlspecialchars($error); ?></h3>
 </div>
 </div>
 </div>
 <?php endif; ?>

 <form class="space-y-6" method="POST" action="register.php">
 <div>
 <label for="name" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Full Name
 </label>
 <div class="mt-2 relative">
 <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
 <i data-feather="user" class="h-5 w-5 text-gray-400"></i>
 </div>
 <input
 id="name"
 name="name"
 type="text"
 required
 class="block w-full rounded-md border-gray-300 dark:border-gray-700   py-2 pl-10 px-3 text-gray-900 dark:text-white shadow-sm border focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm bg-white dark:bg-gray-800"
 placeholder="Enter your full name"
 >
 </div>
 </div>

 <div>
 <label for="username" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Username
 </label>
 <div class="mt-2 relative">
 <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
 <i data-feather="user" class="h-5 w-5 text-gray-400"></i>
 </div>
 <input
 id="username"
 name="username"
 type="text"
 required
 class="block w-full rounded-md border-gray-300 dark:border-gray-700   py-2 pl-10 px-3 text-gray-900 dark:text-white shadow-sm border focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm bg-white dark:bg-gray-800"
 placeholder="Choose a unique username"
 >
 </div>
 </div>

 <div>
 <label for="email" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Email Address
 </label>
 <div class="mt-2 relative">
 <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
 <i data-feather="mail" class="h-5 w-5 text-gray-400"></i>
 </div>
 <input
 id="email"
 name="email"
 type="email"
 required
 class="block w-full rounded-md border-gray-300 dark:border-gray-700   py-2 pl-10 px-3 text-gray-900 dark:text-white shadow-sm border focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm bg-white dark:bg-gray-800"
 placeholder="Email address"
 >
 </div>
 </div>

 <div>
 <label for="password" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Password
 </label>
 <div class="mt-2 relative">
 <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
 <i data-feather="lock" class="h-5 w-5 text-gray-400"></i>
 </div>
 <input
 id="password"
 name="password"
 type="password"
 required
 class="block w-full rounded-md border-gray-300 dark:border-gray-700   py-2 pl-10 px-3 text-gray-900 dark:text-white shadow-sm border focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm bg-white dark:bg-gray-800"
 placeholder="Password"
 minlength="6"
 >
 </div>
 </div>

 <div>
 <button type="submit" class="flex w-full justify-center rounded-md bg-black dark:bg-white px-3 py-2.5 text-sm font-semibold leading-6 text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors active:scale-95">
 Create account
 </button>
 </div>
 </form>
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

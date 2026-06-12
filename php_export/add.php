<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
 header("Location: index.php");
 exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
 $id = uniqid('prod_');
 if(!empty($_POST['custom_id'])) {
 $id = trim($_POST['custom_id']);
 }
 $name = trim($_POST['name']);
 $price = floatval($_POST['price']);
 $stock = intval($_POST['stock']);
 $category = trim($_POST['category']) ?: 'Uncategorized';
 $description = trim($_POST['description']);
 
    $image = trim($_POST['image_url'] ?? '');
    
    if (isset($_FILES['image_file']) && $_FILES['image_file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        $fileName = uniqid() . '_' . basename($_FILES['image_file']['name']);
        $targetFile = $uploadDir . $fileName;
        
        if (move_uploaded_file($_FILES['image_file']['tmp_name'], $targetFile)) { // wait, typo: move_uploaded_file
            $image = $targetFile;
        }
    }
    
    // Fallback if empty image url is submitted
    if (empty($image)) {
 $image = "https://placehold.co/400x500?text=".urlencode($name);
 }

 $stmt = $pdo->prepare("INSERT INTO products (id, name, price, stock, category, description, image) VALUES (?, ?, ?, ?, ?, ?, ?)");
 $stmt->execute([$id, $name, $price, $stock, $category, $description, $image]);
 
 header("Location: dashboard.php");
 exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>Add Product - Mafikul's Store</title>
 
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
 
 <main class="flex-1 py-12">
 <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
 <div class="mb-8">
 <h1 class="font-serif text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Add New Product</h1>
 <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Expand your catalog with a new premium item.</p>
 </div>

 <div class="bg-white dark:bg-gray-900 px-6 py-8 shadow-sm ring-1 ring-gray-900/5 dark:ring-white/5 sm:rounded-xl sm:px-12 border-0">
 <form action="add.php" method="POST" enctype="multipart/form-data" class="space-y-8">
 <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
 <div>
 <label for="name" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Product Name
 </label>
 <div class="mt-2">
 <input
 type="text"
 id="name"
 name="name"
 required
 class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
 placeholder="E.g., Minimalist Desk Lamp"
 >
 </div>
 </div>

 <div>
 <label for="custom_id" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Custom Product ID (Optional)
 </label>
 <div class="mt-2">
 <input
 type="text"
 id="custom_id"
 name="custom_id"
 class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
 placeholder="E.g., 1 or P-001"
 >
 </div>
 </div>
 </div>

 <div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
 <div>
 <label for="category" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Category
 </label>
 <div class="mt-2">
 <select
 id="category"
 name="category"
 required
 class="block w-full rounded-md border-0 py-2.5 px-3 text-gray-900 dark:text-white   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
 >
 <option value="" disabled selected>Select a category</option>
 <option value="Clothing">Clothing</option>
 <option value="Electronics">Electronics</option>
 <option value="Computers">Computers</option>
 <option value="Accessories">Accessories</option>
 <option value="Audio">Audio</option>
 <option value="Wearables">Wearables</option>
 <option value="Home">Home</option>
 <option value="Kitchen">Kitchen</option>
 <option value="Stationery">Stationery</option>
 <option value="Apparel">Apparel</option>
 <option value="Footwear">Footwear</option>
 <option value="Sports">Sports</option>
 <option value="Beauty">Beauty</option>
 <option value="Health">Health</option>
 <option value="Uncategorized">Uncategorized</option>
 </select>
 </div>
 </div>

 <div>
 <label for="price" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Price (৳)
 </label>
 <div class="relative mt-2 rounded-md shadow-sm">
 <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
 <span class="text-gray-500 dark:text-gray-400 sm:text-sm">৳</span>
 </div>
 <input
 type="number"
 id="price"
 name="price"
 step="0.01"
 min="0"
 required
 class="block w-full rounded-md border-0 py-2 pl-9 pr-3 text-gray-900 dark:text-white   ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
 placeholder="0.00"
 >
 </div>
 </div>

 <div>
 <label for="stock" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Stock Quantity
 </label>
 <div class="mt-2">
 <input
 type="number"
 id="stock"
 name="stock"
 min="0"
 required
 class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
 placeholder="0"
 >
 </div>
 </div>
 </div>

 <div>

                    <label class="block text-sm font-medium leading-6 text-gray-900 dark:text-white mb-2">
                        Product Image
                    </label>
                    <div 
                        class="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 dark:border-gray-700 px-6 py-10 bg-white dark:bg-gray-900 transition-colors"
                        id="drop-zone"
                        ondragover="event.preventDefault(); this.classList.add('border-black', 'dark:border-white', 'bg-gray-50', 'dark:bg-gray-800'); this.classList.remove('border-gray-900/25', 'dark:border-gray-700', 'bg-white', 'dark:bg-gray-900');"
                        ondragleave="event.preventDefault(); this.classList.remove('border-black', 'dark:border-white', 'bg-gray-50', 'dark:bg-gray-800'); this.classList.add('border-gray-900/25', 'dark:border-gray-700', 'bg-white', 'dark:bg-gray-900');"
                        ondrop="event.preventDefault(); this.classList.remove('border-black', 'dark:border-white', 'bg-gray-50', 'dark:bg-gray-800'); this.classList.add('border-gray-900/25', 'dark:border-gray-700', 'bg-white', 'dark:bg-gray-900'); document.getElementById('image_file').files = event.dataTransfer.files; previewImage(document.getElementById('image_file'));"
                    >
                        <div class="text-center w-full">
                            <div id="image-preview" class="hidden mx-auto flex justify-center w-full">
                                <img id="preview-img" src="" alt="Preview" class="h-64 object-cover rounded-md" />
                            </div>
                            <div id="upload-prompt" class="">
                                <i data-feather="image" class="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600"></i>
                                <div class="mt-4 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                                    <label
                                        for="image_file"
                                        class="relative cursor-pointer rounded-md bg-transparent font-semibold text-black dark:text-white focus-within:outline-none hover:underline"
                                    >
                                        <span>Upload a file</span>
                                        <input id="image_file" name="image_file" type="file" class="sr-only" accept="image/*" onchange="previewImage(this)" />
                                    </label>
                                    <p class="pl-1">or drag and drop</p>
                                </div>
                                <p class="text-xs leading-5 text-gray-500">PNG, JPG, WebP up to 10MB</p>
                            </div>
                        </div>
                    </div>

                    <div class="mt-4">
                        <label for="image_url" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
                            Or Image URL
                        </label>
                        <div class="mt-2">
                            <input
                                type="url"
                                id="image_url"
                                name="image_url"
                                ${valueStr}
                                class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
                                placeholder="https://..."
                                oninput="previewImageUrl(this.value)"
                            >
                        </div>
                    </div>
<script>
    function previewImage(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('image-preview').classList.remove('hidden');
                document.getElementById('upload-prompt').classList.add('hidden');
                document.getElementById('preview-img').src = e.target.result;
                document.getElementById('image_url').value = ''; 
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    function previewImageUrl(url) {
        if (url) {
            document.getElementById('image-preview').classList.remove('hidden');
            document.getElementById('upload-prompt').classList.add('hidden');
            document.getElementById('preview-img').src = url;
            document.getElementById('image_file').value = '';
        } else {
            document.getElementById('image-preview').classList.add('hidden');
            document.getElementById('upload-prompt').classList.remove('hidden');
            document.getElementById('preview-img').src = '';
        }
    }
</script>
</div>
<div>
 <label for="description" class="block text-sm font-medium leading-6 text-gray-900 dark:text-white">
 Description (Optional)
 </label>
 <div class="mt-2">
 <textarea
 id="description"
 name="description"
 rows="3"
 class="block w-full rounded-md border-0 py-2 px-3 text-gray-900 dark:text-white   shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6 bg-white dark:bg-gray-800"
 placeholder="Detailed description of the product..."
 ></textarea>
 </div>
 </div>

 <div class="pt-4 flex items-center justify-end gap-x-6 border-t border-gray-900/10">
 <a href="dashboard.php" class="text-sm font-semibold leading-6 text-gray-900 dark:text-white">
 Cancel
 </a>
 <button
 type="submit"
 class="rounded-md bg-black dark:bg-white px-8 py-2.5 text-sm font-semibold text-white dark:text-black shadow-sm hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors active:scale-95"
 >
 Publish Product
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

const fs = require('fs');

const dPath = 'php_export/dashboard.php';
let text = fs.readFileSync(dPath, 'utf8');

// replace $products query with $orders query
text = text.replace(
    /\$stmt = \$pdo->query\("SELECT \* FROM products ORDER BY created_at DESC"\);[\s\S]*?\$products = \$stmt->fetchAll\(\);/,
    `$stmt = $pdo->query("SELECT orders.*, users.name as userName FROM orders JOIN users ON orders.user_id = users.id ORDER BY created_at DESC");\n$orders = $stmt->fetchAll();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action']) && isset($_POST['order_id'])) {
    $orderId = $_POST['order_id'];
    $newStatus = $_POST['status'];
    $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->execute([$newStatus, $orderId]);
    header("Location: orders.php");
    exit;
}`
);

// fix nav active state
text = text.replace(
    /<a href="#" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-black dark:border-white text-black dark:text-white relative top-\[1px\]">\s*Inventory\s*<\/a>/,
    `<a href="dashboard.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:border-gray-700 hover:text-gray-700">Inventory</a>`
);
text = text.replace(
    /<a href="#" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:border-gray-700 hover:text-gray-700">\s*Orders\s*<\/a>/,
    `<a href="orders.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-black dark:border-white text-black dark:text-white relative top-[1px]">Orders</a>`
);

// We need to replace the table html
// Let's replace the whole block from "Customer Inventory" title to the table end
let tableHtml = `
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
                                                    $<?php echo number_format($order['total'], 2); ?>
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
`;

text = text.replace(/<div class="sm:flex sm:items-center">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/, tableHtml + '\n                </div>\n            </main>');

text = text.replace(/<title>Dashboard - Mafikul's Store<\/title>/, '<title>Orders - Mafikul\'s Store</title>');

fs.writeFileSync('php_export/orders.php', text);

// Now fix dashboard link to orders:
let dText = fs.readFileSync(dPath, 'utf8');
dText = dText.replace(
    /<a href="#" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:border-gray-700 hover:text-gray-700">\s*Orders\s*<\/a>/,
    `<a href="orders.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-transparent text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:border-gray-700 hover:text-gray-700">Orders</a>`
);
dText = dText.replace(
    /<a href="#" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-black dark:border-white text-black dark:text-white relative top-\[1px\]">\s*Inventory\s*<\/a>/,
    `<a href="dashboard.php" class="whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium border-black dark:border-white text-black dark:text-white relative top-[1px]">Inventory</a>`
);
fs.writeFileSync(dPath, dText);

console.log('Fixed dashboard and created orders page.');

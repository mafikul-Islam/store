<?php
// Simple security check to prevent unauthorized public access
if (!isset($_GET['key']) || $_GET['key'] !== 'admin123') {
    die("Unauthorized access. Please provide the correct setup key in the URL.");
}

require_once 'db_connect.php';

$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['delete_admins'])) {
        try {
            $stmt = $pdo->prepare("DELETE FROM users WHERE role = 'admin'");
            $stmt->execute();
            $deletedCount = $stmt->rowCount();
            $message = "<div style='color: green;'>Successfully deleted $deletedCount admin user(s).</div>";
        } catch (PDOException $e) {
            $message = "<div style='color: red;'>Error deleting admins: " . htmlspecialchars($e->getMessage()) . "</div>";
        }
    } elseif (isset($_POST['create_admin'])) {
        $username = trim($_POST['username']);
        $email = trim($_POST['email']);
        $password = $_POST['password']; // Plain text

        try {
            // First check if exists
            $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE username = ? OR email = ?");
            $stmt->execute([$username, $email]);
            if ($stmt->fetchColumn() > 0) {
                $message = "<div style='color: red;'>Error: Username or email already exists.</div>";
            } else {
                $stmt = $pdo->prepare("INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, 'admin')");
                $stmt->execute(['Administrator', $username, $email, $password]);
                $message = "<div style='color: green;'>Successfully created new admin user '$username' with plain text password.</div>";
            }
        } catch (PDOException $e) {
            $message = "<div style='color: red;'>Error creating admin: " . htmlspecialchars($e->getMessage()) . "</div>";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Reset Tool</title>
    <style>
        body { font-family: sans-serif; max-width: 500px; margin: 40px auto; padding: 20px; background: #fff; border: 1px solid #ddd; border-radius: 8px;}
        h2 { text-align: center; color: #333; }
        .box { padding: 15px; border: 1px solid #eee; margin-bottom: 20px; border-radius: 5px; background: #fafafa;}
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input[type="text"], input[type="email"], input[type="password"] { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; margin-bottom: 10px;}
        button { width: 100%; padding: 10px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; margin-top: 10px; font-weight: bold;}
        .btn-danger { background: #d32f2f; color: #fff;}
        .btn-danger:hover { background: #b71c1c; }
        .btn-success { background: #2e7d32; color: #fff; }
        .btn-success:hover { background: #1b5e20; }
        .links { text-align: center; margin-top: 20px; }
        .links a { color: #000; font-weight: bold;}
    </style>
</head>
<body>

<div class="fixed inset-0 -z-50 overflow-hidden pointer-events-none transition-colors duration-300">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-gray-200/50 dark:from-gray-800/50 to-transparent blur-3xl opacity-50 dark:opacity-30 pointer-events-none"></div>
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 dark:bg-blue-900/20 rounded-full blur-[100px] opacity-50 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-900/20 rounded-full blur-[100px] opacity-50 dark:opacity-40 pointer-events-none"></div>
    <div class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] dark:opacity-[0.05] mix-blend-overlay pointer-events-none"></div>
</div>

    <h2>Admin Reset Tool</h2>
    <?php echo $message; ?>

    <div class="box">
        <h3>Step 1: Delete all existing admins</h3>
        <form method="POST">
            <input type="hidden" name="delete_admins" value="1">
            <button type="submit" class="btn-danger" onclick="return confirm('Are you sure you want to delete ALL admin users?');">Delete All Admin Users</button>
        </form>
    </div>

    <div class="box">
        <h3>Step 2: Create a new admin (Plain Text)</h3>
        <form method="POST">
            <input type="hidden" name="create_admin" value="1">
            <label for="username">Username</label>
            <input type="text" id="username" name="username" required placeholder="e.g. admin">
            
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required placeholder="e.g. mafikul.bdset@gmail.com">
            
            <label for="password">Password (Plain text)</label>
            <input type="password" id="password" name="password" required placeholder="e.g. mySecurePassword123">
            
            <button type="submit" class="btn-success">Create Admin</button>
        </form>
    </div>

    <div class="links">
        <a href="login.php">Go back to Login Page</a>
    </div>
</body>
</html>

<?php
session_start();
require_once 'db_connect.php';

if (!isset($_SESSION['user_id']) || $_SESSION['user_role'] !== 'admin') {
 header("Location: index.php");
 exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
 $id = $_POST['id'];
 $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
 $stmt->execute([$id]);
}

header("Location: dashboard.php");
exit;
?>

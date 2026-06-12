<?php
session_start();
require_once 'db_connect.php';
header('Content-Type: application/json');

if (isset($_GET['add'])) {
    $id = $_GET['add'];
    $qty = isset($_GET['qty']) ? (int)$_GET['qty'] : 1;

    $stmt = $pdo->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->execute([$id]);
    $product = $stmt->fetch();

    if ($product) {
        if (!isset($_SESSION['cart'])) {
            $_SESSION['cart'] = [];
        }
        if (isset($_SESSION['cart'][$id])) {
            $_SESSION['cart'][$id]['quantity'] += $qty;
        } else {
            $_SESSION['cart'][$id] = [
                'product' => $product,
                'quantity' => $qty
            ];
        }
        echo json_encode(['success' => true, 'name' => $product['name']]);
        exit;
    }
}
echo json_encode(['success' => false]);

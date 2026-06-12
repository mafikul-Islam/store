<?php
require_once 'db_connect.php';

header('Content-Type: application/json');

try {
 $stmt = $pdo->query("SELECT * FROM products ORDER BY created_at DESC");
 $products = $stmt->fetchAll();
 echo json_encode(['status' => 'success', 'data' => $products]);
} catch (Exception $e) {
 http_response_code(500);
 echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>

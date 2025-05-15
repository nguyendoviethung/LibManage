<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Xử lý logout
session_start();
$_SESSION = [];
session_destroy();
setcookie("PHPSESSID", "", time() - 3600, "/");

echo json_encode(["success" => true]);
?>

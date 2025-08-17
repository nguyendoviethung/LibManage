<?php
// cors.php - cấu hình CORS chung cho toàn bộ API

header('Content-Type: application/json');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Lấy origin từ request
if (isset($_SERVER['HTTP_ORIGIN'])) {
    $origin = $_SERVER['HTTP_ORIGIN'];
    // Cho phép tất cả origin bắt đầu bằng "http://localhost" (mọi port)
    if (preg_match('/^http:\/\/localhost(:[0-9]+)?$/', $origin)) {
        header("Access-Control-Allow-Origin: $origin");
    }
}

// Xử lý preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Lấy data từ frontend gửi lên 
$data = json_decode(file_get_contents("php://input"), true);
?>
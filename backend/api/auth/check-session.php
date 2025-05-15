<?php
session_start();
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if (!isset($_SESSION['username'])) { // $_SESSION['username' là biến lưu mã người dùng khi họ đã đăng nhập.
  http_response_code(401); // Kiểm tra có tồn tại hay chưa , nếu chưa trả về mã trạng thái HTTP là 401 Unauthorized (không được phép).
  echo json_encode(["error" => "Unauthorized"]);
  exit;
}

echo json_encode(["success" => true]);
?>

<?php
session_start();

// CORS headers để frontend React có thể gửi cookie sang
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // chính xác domain
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: POST');

// Lấy dữ liệu từ React gửi lên
$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['loginUsername']) || !isset($data['loginPassword'])) {
    echo json_encode([
        "success" => false,
        "message" => "Thiếu thông tin đăng nhập!"
    ]);
    exit;
}

$loginUsername = $data['loginUsername'];
$loginPassword = $data['loginPassword'];

// Kết nối DB
include '../../config/connect.php';

$query = "SELECT * FROM readeraccounts WHERE username = $1";
$result = pg_query_params($conn, $query, [$loginUsername]);

if ($row = pg_fetch_assoc($result)) {
    if (password_verify($loginPassword, $row['password'])) {
        // Lưu thông tin người dùng vào session
        $_SESSION['username'] = $row['username'];
        $_SESSION['role'] = $row['role'];
        $_SESSION['student_id'] = $row['student_id'];

        // Cập nhật lần đăng nhập
        $updateQuery = "UPDATE readeraccounts SET last_login = NOW() WHERE username = $1";
        pg_query_params($conn, $updateQuery, [$loginUsername]);

        echo json_encode([
            "success" => true,
            "message" => "Đăng nhập thành công!",
            "role" => $row['role'],
            "userID" => $row['student_id'],
        ]);
        pg_close($conn);
        exit;
    }
}

// Đăng nhập sai
echo json_encode([
    "success" => false,
    "message" => "Tài khoản hoặc mật khẩu không đúng!"
]);
pg_close($conn);
?>

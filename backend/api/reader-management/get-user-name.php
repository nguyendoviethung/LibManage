<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php';

if (!$conn) {
    echo json_encode([
        "success" => false,
        "message" => "Không thể kết nối cơ sở dữ liệu."
    ]);
    exit;
}

// Nhận dữ liệu từ frontend
$data = json_decode(file_get_contents('php://input'), true);
$studentID = $data['student_id'] ?? '';

// Kiểm tra đầu vào
if (empty($studentID)) {
    echo json_encode([
        "success" => false,
        "message" => "Thiếu mã số sinh viên."
    ]);
    pg_close($conn);
    exit;
}

// Truy vấn để lấy thông tin tài khoản
$query = "SELECT username, status FROM readeraccounts WHERE student_id = $1";
$result = pg_query_params($conn, $query, [$studentID]);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi truy vấn: " . pg_last_error()
    ]);
    pg_close($conn);
    exit;
}

if (pg_num_rows($result) === 0) {
    echo json_encode([
        "success" => false,
        "message" => "Không tìm thấy tài khoản cho mã số sinh viên này."
    ]);
} else {
    $account = pg_fetch_assoc($result);
    echo json_encode([
        "success" => true,
        "data" => $account
    ]);
}

pg_close($conn);
?>

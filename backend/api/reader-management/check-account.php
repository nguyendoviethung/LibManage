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
$studentID = $data['studentID'] ?? '';


// Truy vấn kiểm tra
$query = "SELECT 1 FROM readeraccounts WHERE student_id = $1";
$result = pg_query_params($conn, $query, [$studentID]);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi truy vấn cơ sở dữ liệu."
    ]);
    exit;
}

// Kiểm tra có bản ghi nào không
if (pg_num_rows($result) > 0) {
    echo json_encode([
        "success" => true,
        "message" => "Đã tồn tại tài khoản cho sinh viên này."
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Chưa có tài khoản cho sinh viên này."
    ]);
}

pg_close($conn);
?>

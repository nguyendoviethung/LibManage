<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Đặt tiêu đề cho phản hồi là JSON
include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

// Lấy dữ liệu JSON từ body của request
$data = json_decode(file_get_contents("php://input"), true);
$bookID = $data['book_id'];

   if (pg_result_error_field($delete_result, PGSQL_DIAG_SQLSTATE) === '23503') {
    echo json_encode([
        'success' => false,
        'message' => 'Không thể xoá sách vì đang có người mượn.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi khi xoá sách: ' . pg_last_error($conn)
    ]);
}

?>

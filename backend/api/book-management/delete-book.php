<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
include '../../config/connect.php';

// Lấy dữ liệu JSON từ body của request
$data = json_decode(file_get_contents("php://input"), true);
$bookID = $data['book_id'] ?? null;

// Kiểm tra dữ liệu đầu vào
if (!$bookID) {
    echo json_encode([
        'success' => false,
        'message' => 'Thiếu book_id để xoá.'
    ]);
    exit;
}

// Thay vì xóa sách thật sự, ta đánh dấu is_deleted = true
$query = "UPDATE books SET is_deleted = true WHERE book_id = $1";
$result = pg_query_params($conn, $query, [$bookID]);

if ($result) {
    echo json_encode([
        'success' => true,
        'message' => 'Xóa sách thành công'
    ]);
} else {
       echo json_encode([
            'success' => false,
            'message' => 'Lỗi khi xoá sách: ' . pg_last_error($conn)
        ]);
    }


pg_close($conn);
?>

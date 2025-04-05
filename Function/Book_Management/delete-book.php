<?php
include 'connect.php'; // Kết nối đến cơ sở dữ liệu

// Lấy dữ liệu JSON từ body của request
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu hợp lệ
if (isset($data['bookName']) && !empty($data['bookName'])) {
    $bookName = $data['bookName'];

    // Kiểm tra kết nối CSDL (Nếu chưa kết nối thì dừng)
    if (!$conn) {
        die("Kết nối thất bại: " . pg_last_error());
    }

    // Truy vấn để kiểm tra nếu sách tồn tại
    $check_query = "SELECT * FROM books WHERE title = $1";
    $check_result = pg_query_params($conn, $check_query, [$bookName]);

    // Nếu sách không tồn tại
    if (pg_num_rows($check_result) == 0) {
        echo json_encode(['success' => false, 'message' => 'Sách không tồn tại']);
        exit();
    }

    // Truy vấn để xóa sách khỏi cơ sở dữ liệu
    $delete_query = "DELETE FROM books WHERE title = $1";
    $delete_result = pg_query_params($conn, $delete_query, [$bookName]);

    // Kiểm tra kết quả xóa
    if ($delete_result) {
        echo json_encode(['success' => true, 'message' => 'Sách đã được xóa']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi khi xóa sách: ' . pg_last_error()]);
    }

    // Đóng kết nối
    pg_close($conn);
} else {
    echo json_encode(['success' => false, 'message' => 'Tên sách không hợp lệ']);
}
?>

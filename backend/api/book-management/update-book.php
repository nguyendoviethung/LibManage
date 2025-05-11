<?php
   header("Access-Control-Allow-Origin: http://localhost:3000");
   header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type");
   header('Content-Type: application/json'); // Đặt tiêu đề cho phản hồi là JSON
   include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

// Lấy dữ liệu JSON từ body của request
$data = json_decode(file_get_contents("php://input"), true);
// Kiểm tra kết nối đến cơ sở dữ liệu
// Lấy các giá trị từ dữ liệu JSON
$title = $data['title'] ?? '';
$author = $data['author'] ?? '';
$language = $data['language'] ?? '';
$year = $data['year'] ?? '';
$location = $data['location'] ?? '';
$genre = $data['genre'] ?? '';
$quantity = $data['quantity'] ?? '';

// Kiểm tra nếu các thông tin cần thiết đã được cung cấp
    if (empty($title) || empty($author)) {
    echo json_encode(['success' => false, 'message' => 'Tên sách và tên tác giả không được để trống.']);
    exit();
     }

// Cập nhật thông tin sách trong cơ sở dữ liệu
        $query = "UPDATE books SET 
            author_name = $1,
            lang = $2,
            publisher_year = $3,
            location = $4,
            genre = $5,
            quantity = $6
          WHERE title = $7";

    $result = pg_query_params($conn, $query, [
    $author,
    $language,
    $year,
    $location,
    $genre,
    $quantity,
    $title
]);

// Kiểm tra kết quả của câu lệnh UPDATE
if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi khi cập nhật sách: ' . pg_last_error($conn)]);
}

// Đóng kết nối
pg_close($conn);
?>
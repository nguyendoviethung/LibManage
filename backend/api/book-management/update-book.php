<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php';
// Lấy dữ liệu từ request
$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? ''; // tên sách mới
$author = $data['author_name'] ?? '';
$language = $data['lang'] ?? '';
$year = $data['publisher_year'] ?? '';
$quantity = (is_numeric($data['quantity']) && $data['quantity'] !== '') ? (int)$data['quantity'] : null;
$location = $data['location'] ?? '';
$genre = $data['genre'] ?? '';


//Kiểm tra tên sách mới đã tồn tại trong hệ thống chưa

$query = "UPDATE books SET 
    title = $1,
    author_name = $2,
    lang = $3,
    publisher_year = $4,
    location = $5,
    genre = $6,
    quantity = $7
    WHERE title = $1";

$result = pg_query_params($conn, $query, [
    $title,
    $author,
    $language,
    $year,
    $location,
    $genre,
    $quantity
]);

if ($result) {
    echo json_encode(['success' => true,'message' => 'Chỉnh sửa thành công']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi khi cập nhật sách: ' . pg_last_error($conn)]);
}



pg_close($conn);
?>

<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php';

// Lấy dữ liệu từ request
$data = json_decode(file_get_contents("php://input"), true);

$title = $data['title'] ?? ''; // tên sách mới
$author = $data['author'] ?? '';
$language = $data['language'] ?? '';
$year = (is_numeric($data['year']) && $data['year'] !== '') ? (int)$data['year'] : null;
$quantity = (is_numeric($data['quantity']) && $data['quantity'] !== '') ? (int)$data['quantity'] : null;
$location = $data['location'] ?? '';
$genre = $data['genre'] ?? '';
$oldTitle = $data['oldTitle'] ?? ''; // tên sách cũ

//Kiểm tra tên sách mới đã tồn tại trong hệ thống chưa
$checkTitle = "SELECT title from books where title = $1";
$resultCheckTitle = pg_query_params($conn,$checkTitle,[$title]);

if (!$resultCheckTitle) {
    die("Lỗi truy vấn kiểm tra tiêu đề sách: " . pg_last_error($conn));
}

if (pg_num_rows($resultCheckTitle) > 0) {
    //Có ít nhất 1 sách trùng tiêu đề
    echo json_encode(["success" => false, "message" => "Tiêu đề sách đã tồn tại"]);
    exit; // Thoát chương trình
} else {
    // Không có sách nào trùng
   // Cập nhật dữ liệu
$query = "UPDATE books SET 
    title = $1,
    author_name = $2,
    lang = $3,
    publisher_year = $4,
    location = $5,
    genre = $6,
    quantity = $7
WHERE title = $8";

$result = pg_query_params($conn, $query, [
    $title,
    $author,
    $language,
    $year,
    $location,
    $genre,
    $quantity,
    $oldTitle
]);

if ($result) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi khi cập nhật sách: ' . pg_last_error($conn)]);
}

}

pg_close($conn);
?>

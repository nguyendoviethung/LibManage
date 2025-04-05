<?php
header('Content-Type: application/json'); // Đặt tiêu đề cho phản hồi là JSON
include '../Auth/connect.php';
$data = json_decode(file_get_contents("php://input"), true);
// Truy vấn tìm sách theo tên
if (!$conn) {
    die("Kết nối thất bại: " . pg_last_error());
}
$bookTitle  = $data['bookTitle'] ?? ''; // Lấy tên sách từ dữ liệu JSON
$query = "SELECT * FROM books WHERE title = $1";
$result = pg_query_params($conn, $query, [$data['bookTitle']]);
if (pg_num_rows($result) > 0) {
    $row = pg_fetch_assoc($result);
    echo json_encode([
        'success' => true,
        'book' => [
            'author_name' => $row['author_name'],
            'title' => $row['title'],
            'lang' => $row['lang'],
            'publisher_year' => $row['publisher_year'],
            'location' => $row['location'],
            'genre' => $row['genre'],
            'quantity' => $row['quantity']
        ]
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Không tìm thấy sách']);
}
pg_close($conn);
?>
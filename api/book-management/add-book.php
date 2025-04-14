<?php
header('Content-Type: application/json'); // Đặt tiêu đề cho phản hồi là JSON

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu
// Lấy dữ liệu JSON từ body của request
$data = json_decode(file_get_contents("php://input"), true);

// Kiểm tra dữ liệu hợp lệ
if (isset($data['additionalBookTitle']) && isset($data['authorNameAdded'])) {

    // Kiểm tra kết nối CSDL (Nếu chưa kết nối thì dừng)
    if (!$conn) {
        die("Kết nối thất bại: " . pg_last_error());
    }
    $check_query = "SELECT * FROM books WHERE title = $1";
    $check_result = pg_query_params($conn, $check_query, [$data['additionalBookTitle']]);
    // Đếm số dòng kết quả trong một truy vấn SELECT(ở đây là kiểm tra xem sách đã tồn tại hay chưa)
    // Nếu có dòng nào trả về thì sách đã tồn tại
    if (pg_num_rows($check_result) > 0) {
        echo json_encode(['success' => false, 'message' => 'Sách đã tồn tại']);
        exit();
    }   
    // Truy vấn để thêm sách vào cơ sở dữ liệu
    $query = "INSERT INTO books (title, author_name, lang, publisher_year, location, genre, quantity) 
    VALUES ($1, $2, $3, $4, $5, $6, $7)";

$result = pg_query_params($conn, $query, [
$data['additionalBookTitle'], // title
$data['authorNameAdded'],     // author_name
$data['bookLang'],            // lang
$data['publishYear'],         // publisher_year
$data['bookLocation'],        // location
$data['genre'],               // genre
$data['quantity']        // quantity 
]);

    // Kiểm tra kết quả
    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Sách đã được thêm']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Lỗi khi thêm sách: ' . pg_last_error()]);
    }

    // Đóng kết nối
    pg_close($conn);
} else {
    echo json_encode(['success' => false, 'message' => 'Dữ liệu không hợp lệ']);
}

?>

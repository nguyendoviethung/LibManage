<?php
   header("Access-Control-Allow-Origin: http://localhost:3000");
   header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type");
   header('Content-Type: application/json'); // Đặt tiêu đề cho phản hồi là JSON
   include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

// Kiểm tra kết nối trước khi dùng
if (!$conn) {
    echo json_encode(["error" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}

// Đọc dữ liệu JSON từ client
$data = json_decode(file_get_contents('php://input'), true);
$searchTerm = $data['searchTerm'] ?? ''; //Giá trị tìm kiếm
$category = $data['category'] ?? '';  // Giá trị bộ lọc theo thể loại

// Truy vấn dữ liệu
if($searchTerm === ''){ // Nếu giá trị thanh tìm kiếm rỗng thì tìm theo yêu cầu về thể loại
    if($category === "Tất cả"){
        $query = "SELECT * FROM books WHERE is_deleted = $1 ORDER BY book_id ASC";
        $result = pg_query_params($conn, $query,['false']);
    }else {
        $query = "SELECT * FROM books WHERE genre = $1 AND is_deleted = $2 ORDER BY book_id ASC";
        $result = pg_query_params($conn, $query,[$category,'false']);
    }
}else{ // Tìm theo giá trị của thanh tìm kiếm
    $query = "SELECT * FROM books WHERE title = $1 AND is_deleted = $2 ORDER BY book_id ASC";
    $result = pg_query_params($conn, $query,[$searchTerm,'false']);
}
// Kiểm tra kết quả trả về từ SQL
if (!$result) {
    echo json_encode(["error" => "⚠️ Lỗi truy vấn: " . pg_last_error($conn)]);
    exit;
}

$books = []; // Mảng để lưu trữ kết quả
while ($row = pg_fetch_assoc($result)) {
    $books[] = [
        'book_id' => $row['book_id'],
        'title' => $row['title'],
        'lang' => $row['lang'],
        'publisher_year' => $row['publisher_year'],
        'location' => $row['location'],
        'genre' => $row['genre'],
        'quantity' => $row['quantity'],
        'author_name' => $row['author_name']
    ];
}

if (count($books) > 0) {
   //Nếu có sách thì trả về mảng sách theo yêu cầu 
    echo json_encode([
        "success" => true,
        "data"   => $books
    ]);
} else {
    // Không tìm thấy sách nào
    echo json_encode([
        "success" => false,
        "message" => "Không tìm thấy sách nào !"
    ]);
}
// Đóng kết nối
pg_close($conn);
?>

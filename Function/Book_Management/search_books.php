<?php
include 'connect.php';

header('Content-Type: application/json'); // ✅ Khai báo rõ ràng kiểu trả về

// Kiểm tra kết nối trước khi dùng
if (!$conn) {
    echo json_encode(["error" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}

// Đọc dữ liệu JSON từ client
$data = json_decode(file_get_contents('php://input'), true);
$bookName = $data['bookName'] ?? ''; //Gán biến $bookName bằng $data['bookName'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.

// Truy vấn dữ liệu
$query = "SELECT title, lang, publisher_year, location, genre, quantity, author_name FROM public.books WHERE title = $1";
$result = pg_query_params($conn, $query, [$bookName]);

// Kiểm tra kết quả trả về từ SQL
if (!$result) {
    echo json_encode(["error" => "⚠️ Lỗi truy vấn: " . pg_last_error($conn)]);
    exit;
}

$books = [];
while ($row = pg_fetch_assoc($result)) {
    $books[] = [
        'title' => $row['title'],
        'lang' => $row['lang'],
        'publisher_year' => $row['publisher_year'],
        'location' => $row['location'],
        'genre' => $row['genre'],
        'quantity' => $row['quantity'],
        'author_name' => $row['author_name']
    ];
}

// Nếu không có kết quả
if (count($books) > 0) {
    echo json_encode($books);
} else {
    echo json_encode(["message" => "Không tìm thấy sách nào!"]);
}

pg_close($conn);
?>

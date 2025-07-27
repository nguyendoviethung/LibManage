<?php
// Kết nối đến cơ sở dữ liệu
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

// Lấy số lượng cuốn sách trong thư viện
$query = "SELECT title, author_name,quantity 
          FROM public.books
          ORDER BY quantity 
          DESC LIMIT 5 ;";
          
$result = pg_query($conn, $query);
$new_books = pg_fetch_all($result);

if ($new_books === false) {
    echo json_encode(['error' => 'Không có sách mới được thêm']);
} else {
    echo json_encode($new_books); // Trả về mảng các object
}

pg_close($conn);
?>
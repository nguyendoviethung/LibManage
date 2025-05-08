<?php
header("Access-Control-Allow-Origin: http://localhost:3000"); // Cho phép truy cập từ localhost:3000
header("Content-Type: application/json; charset=UTF-8");

// phần code PHP còn lại...

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

//Truy vấn lấy số lượng sách theo thể loại
$query = "SELECT genre, COUNT(*) AS total_books FROM books GROUP BY genre";
$result = pg_query($conn, $query);

// Lấy dữ liệu và chuyển sang định dạng JSON
$books_data = pg_fetch_all($result);
echo json_encode($books_data);
?>
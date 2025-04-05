<?php
// Kết nối đến cơ sở dữ liệu
include 'connect.php';

//Truy vấn lấy số lượng sách theo thể loại
$query = "SELECT genre, COUNT(*) AS total_books FROM books GROUP BY genre";
$result = pg_query($conn, $query);

// Lấy dữ liệu và chuyển sang định dạng JSON
$books_data = pg_fetch_all($result);
echo json_encode($books_data);
?>
<?php
// Kết nối đến cơ sở dữ liệu
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

// Lấy số lượng cuốn sách trong thư viện
$query_1 = "SELECT SUM(quantity) AS total_books FROM books;";
$result_1 = pg_query($conn, $query_1);
$total_books = pg_fetch_all($result_1);

// Lấy số lượng độc giả đang mượn sách từ thư viện
$query_2 = "SELECT COUNT(*) AS total_readers FROM reader WHERE status = 'Active';";
$result_2 = pg_query($conn, $query_2);
$total_readers = pg_fetch_all($result_2);

// Lấy số lượng sách đang được mượn
$query_3 = "SELECT COUNT(*) AS total_borrowed_books FROM borrowrecords WHERE return_date IS NULL;";
$result_3 = pg_query($conn, $query_3);
$total_borrowed_books = pg_fetch_all($result_3);

// Lấy số lượng sách quá han
$query_4 = "SELECT COUNT(*) AS total_overdue_books FROM borrowrecords WHERE return_date IS NULL AND due_date < NOW();";
$result_4 = pg_query($conn, $query_4);
$total_overdue_books = pg_fetch_all($result_4);

echo json_encode([
    'totalBooks' => $total_books[0]['total_books'],
    'totalReaders' => $total_readers[0]['total_readers'],
    'borrowedBooks' => $total_borrowed_books[0]['total_borrowed_books'],
    'overdueBooks' => $total_overdue_books[0]['total_overdue_books']
]);
?>
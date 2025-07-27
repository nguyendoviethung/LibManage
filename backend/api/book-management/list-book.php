<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

// Câu truy vấn SQL: lấy tất cả sách và sắp xếp theo ID tăng dần
$query = "SELECT * FROM books WHERE is_deleted = $1 ORDER BY book_id ASC";

$result = pg_query_params($conn, $query,['false']);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi truy vấn cơ sở dữ liệu"
    ]);
    exit;
}

$data = pg_fetch_all($result);

if($data === false) {
    echo json_encode([
        "success" => false,
        "message" => "Không có sách nào được tìm thấy"
    ]);
    exit;
} else {
echo json_encode([
    "success" => true,
    "data" => $data
]);
}
?>

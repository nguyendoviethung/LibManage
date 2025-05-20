<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php';

// Truy vấn dữ liệu từ bảng reader
$query = "SELECT * FROM reader WHERE status = $1 ORDER BY reader_id ASC";
$result = pg_query_params($conn, $query,["Active"]);

if (!$result) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi truy vấn dữ liệu"
    ]);
    exit;
}
//Mảng gồm các object
$readers = [];

while ($row = pg_fetch_assoc($result)) {
    $readers[] = $row;
}

// Trả về dữ liệu dưới dạng JSON
echo json_encode([
    "success" => true,
    "data" => $readers
]);

pg_close($conn);
?>

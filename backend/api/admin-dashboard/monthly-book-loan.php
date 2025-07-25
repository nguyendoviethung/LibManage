<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

// Kiểm tra kết nối
if (!$conn) {
    http_response_code(500);
    echo json_encode(["error" => "Kết nối cơ sở dữ liệu thất bại"]);
    exit;
}

$query = "SELECT 
        TO_CHAR(borrow_date, 'YYYY-MM') AS month,
        COUNT(*) AS count
        FROM borrowrecords
        WHERE borrow_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '12 months'
        AND borrow_date <= date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'
        GROUP BY month
        ORDER BY month";

$result = pg_query($conn, $query);

// Kiểm tra kết quả truy vấn
if (!$result) {
    http_response_code(500);
    echo json_encode(["error" => "Lỗi truy vấn cơ sở dữ liệu"]);
    exit;
}

$data = pg_fetch_all($result);

// Nếu không có dữ liệu, trả về mảng rỗng
if (!$data) {
    $data = [];
}

echo json_encode($data);
?>

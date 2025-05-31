<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php';

// Nhận dữ liệu từ frontend
$data = json_decode(file_get_contents("php://input"), true);
$studentID = $data['studentID'];

// Lấy tiêu đề, ID của sách mà sinh viên đang mượn
$query = "SELECT
  br.book_id,
  b.title
FROM borrowrecords br
JOIN reader r ON br.reader_id = r.reader_id
JOIN books b ON br.book_id = b.book_id
WHERE r.student_id = $1
AND br.return_date is NULL
AND b.is_deleted = false";

$result = pg_query_params($conn, $query, [$studentID]);

// Xử lý kết quả
if ($result && pg_num_rows($result) > 0) {
    $books = [];
    while ($row = pg_fetch_assoc($result)) {
        $books[] = $row;
    }
    echo json_encode([
        'success' => true,
        'data' => $books
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Không có sách nào được mượn'
    ]);
}

pg_close($conn);
?>

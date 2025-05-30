<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php';

// Nhận dữ liệu từ frontend
$data = json_decode(file_get_contents("php://input"), true);
$studentID = $data['studentID'];
$bookIDs = $data['bookIDs'];  // Mảng chứa book_id
$returnDate = date("Y-m-d H:i:s");

$success = true;
$errors = [];

foreach ($bookIDs as $bookId) {
    // 1. Cập nhật return_date cho mượn đúng sách + đúng sinh viên
    $queryReturn = "
        UPDATE borrowrecords
        SET return_date = $1
        FROM reader
        WHERE borrowrecords.reader_id = reader.reader_id
          AND reader.student_id = $2
          AND borrowrecords.book_id = $3
          AND borrowrecords.return_date IS NULL
    ";

    $resultReturn = pg_query_params($conn, $queryReturn, [$returnDate, $studentID, $bookId]);

    if (!$resultReturn) {
        $success = false;
        $errors[] = "Lỗi cập nhật borrowrecords cho sách ID: $bookId";
        continue;
    }

    // 2. Cập nhật lại số lượng sách trong bảng books
    $queryQuantity = "
        UPDATE books
        SET quantity = quantity + 1
        WHERE book_id = $1
    ";

    $resultQuantity = pg_query_params($conn, $queryQuantity, [$bookId]);

    if (!$resultQuantity) {
        $success = false;
        $errors[] = "Lỗi cập nhật quantity cho sách ID: $bookId";
    }
}

pg_close($conn);

// Phản hồi về frontend
if ($success) {
    echo json_encode([
        'success' => true,
        'message' => 'Trả sách thành công.'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Một số sách trả không thành công.',
        'errors' => $errors
    ]);
}
?>

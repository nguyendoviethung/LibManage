<?php
  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header('Content-Type: application/json'); // Đặt tiêu đề cho phản hồi là JSON
  include '../../config/connect.php'; // Kết nối CSDL

// Lấy dữ liệu JSON từ request
$data = json_decode(file_get_contents("php://input"), true);
$readerID = $data['readerID'];
$bookID = $data['bookID'];

// Kiểm tra dữ liệu đầu vào
if (!$data) {
  echo json_encode([
      'success' => false,
      'message' => 'Không nhận được dữ liệu từ client'
  ]);
  exit;
}

//Lấy time hiện tại và thời gian hết hạn
date_default_timezone_set('Asia/Ho_Chi_Minh'); // Múi giờ VN
$borrowDate = date("Y-m-d H:i:s");
$dueDate = date("Y-m-d H:i:s", strtotime("+14 days"));

// 1. Ghi vào bảng mượn sách
$queryBorrowRecords = "
  INSERT INTO borrowrecords (reader_id, book_id, borrow_date, due_date)
  VALUES ($1, $2, $3, $4)
  ";
$resultBorrowRecords = pg_query_params($conn, $queryBorrowRecords, [$readerID, $bookID, $borrowDate, $dueDate]);

// 2. Cập nhật số lượng sách
$queryBooks = "
  UPDATE books
  SET quantity = quantity - 1
  WHERE book_id = $1 AND quantity > 0
";
$resultBooks = pg_query_params($conn, $queryBooks, [$bookID]);

// 3. Trả về kết quả
if ($resultBorrowRecords == true && $resultBooks == true ) {
    echo json_encode([
        'success' => true,
        'message' => 'Mượn sách thành công!'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Có lỗi khi mượn sách.'
    ]);
}
// Đóng kết nối CSDL
pg_close($conn);
?>

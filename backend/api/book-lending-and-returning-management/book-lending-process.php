<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');
include '../../config/connect.php';

// Lấy dữ liệu JSON từ request
$data = json_decode(file_get_contents("php://input"), true);
$studentId = $data['studentId'];
$bookIDs = $data['bookIDs'];

if (!$data || !$studentId || !is_array($bookIDs)) {
  echo json_encode([
    'success' => false,
    'message' => 'Dữ liệu không hợp lệ'
  ]);
  exit;
}

// 🔍 Truy vấn reader_id từ student_id
$queryReader = "SELECT reader_id FROM reader WHERE student_id = $1";
$resultReader = pg_query_params($conn, $queryReader, [$studentId]);
$rowReader = pg_fetch_assoc($resultReader);

if (!$rowReader) {
  echo json_encode([
    'success' => false,
    'message' => 'Không tìm thấy sinh viên trong hệ thống'
  ]);
  exit;
}

$readerId = $rowReader['reader_id'];

// Múi giờ và ngày giờ ở Việt Nam
date_default_timezone_set('Asia/Ho_Chi_Minh');
$borrowDate = date("Y-m-d H:i:s");
$dueDate = date("Y-m-d H:i:s", strtotime("+14 days"));

$successCount = 0;

foreach ($bookIDs as $bookID) {
  // 1. Ghi vào bảng mượn sách
  $queryBorrow = "
    INSERT INTO borrowrecords (reader_id, book_id, borrow_date, due_date)
    VALUES ($1, $2, $3, $4)
  ";
  $resultBorrow = pg_query_params($conn, $queryBorrow, [$readerId, $bookID, $borrowDate, $dueDate]);

  // 2. Cập nhật số lượng sách
  $queryUpdate = "
    UPDATE books
    SET quantity = quantity - 1
    WHERE book_id = $1 AND quantity > 0
  ";
  $resultUpdate = pg_query_params($conn, $queryUpdate, [$bookID]);

  if ($resultBorrow && $resultUpdate) {
    $successCount++;
  }
}

// 3. Phản hồi
if ($successCount === count($bookIDs)) {
  echo json_encode([
    'success' => true,
    'message' => 'Mượn tất cả sách thành công!'
  ]);
} elseif ($successCount > 0) {
  echo json_encode([
    'success' => true,
    'message' => "Mượn một phần thành công ($successCount/".count($bookIDs).")"
  ]);
} else {
  echo json_encode([
    'success' => false,
    'message' => 'Không thể mượn sách nào.'
  ]);
}

pg_close($conn);
?>

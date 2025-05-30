<?php 
  header("Access-Control-Allow-Origin: http://localhost:3000");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type");
  header('Content-Type: application/json'); // Đặt tiêu đề cho phản hồi là JSON
  include '../../config/connect.php'; // Kết nối cơ sở dữ liệu

// Lấy dữ liệu JSON từ request body
 $data = json_decode(file_get_contents("php://input"), true);
 $studentId = $data['studentId'] ?? null; // Lấy mã sinh viên từ dữ liệu JSON, nếu không có thì gán là null

 if (!$studentId) {
    echo json_encode(['success' => false, 'message' => 'Thiếu mã sinh viên']);
    exit;
}

// Câu truy vấn lấy reader_id nếu tài khoản còn hoạt động 
  $query = "SELECT r.reader_id
  FROM reader r
  JOIN readeraccounts ra ON r.student_id = ra.student_id
  WHERE r.student_id = $1 
  AND ra.status = 'Active' ";


// Thực hiện truy vấn với tham số
  $result = pg_query_params($conn, $query, [$studentId]);

//Lấy kết quả truy vấn
  $check_result = pg_fetch_assoc($result);

// Kiểm tra kết quả truy vấn và trả về phản hồi JSON
  if ($check_result) {
    echo json_encode([
        'success' => true,
        'reader_id' => $check_result['reader_id'],
        'message' => 'Sinh viên này được phép mượn sách'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Sinh viên không được phép mượn sách do tài khoản không còn hoạt động'
    ]);
    // Sau này phát triển thêm kiểm tra xem có sách chưa trả vượt quá mức cho phép hay không 
    
}
?>

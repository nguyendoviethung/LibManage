<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Đặt tiêu đề cho phản hồi là JSON

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu
if (!$conn) {
    echo json_encode(["error" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}
// Đọc dữ liệu JSON từ client
$data = json_decode(file_get_contents('php://input'), true);
$searchTerm = $data['searchTerm'] ?? ''; 
$option = $data['option'] ?? '';

if (preg_match('/^\d+$/', $searchTerm)) { // Tìm kiếm theo mã số sinh viên 
   $query = "SELECT * FROM reader WHERE student_id = $1 AND status = $2";
   $result = pg_query_params($conn, $query, [$searchTerm,"Active"]);
} else if($searchTerm === ''){ // Nếu thanh tìm kiếm không có dữ liệu thì tìm kiếm theo bộ lọc
   if($option ==='Tất cả'){
    $query = "SELECT * FROM reader WHERE status = $1 ORDER BY reader_id ASC ";
    $result = pg_query_params($conn, $query, ["Active"]);
   }else{
    $query = "SELECT * FROM reader where faculty = $1 AND status = $2 ORDER BY reader_id ASC";
    $result = pg_query_params($conn, $query,[$option,"Active"]);
   }
}else {
    if($option === 'Tất cả'){
   $query = "SELECT * FROM reader WHERE full_name = $1 AND status = $2 ORDER BY reader_id ASC";
   $result = pg_query_params($conn, $query, [$searchTerm,"Active"]);
  } else {
   $query = "SELECT * FROM reader WHERE full_name = $1 AND faculty = $2 AND status = $3 ORDER BY reader_id ASC";
   $result = pg_query_params($conn, $query, [$searchTerm,$option,"Active"]);
  }
}
 
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

if (empty($readers)) {
    echo json_encode([
        "success" => false,
        "message" => "Không tìm thấy sinh viên nào."
    ]);
    exit;
}

// Trả về dữ liệu dưới dạng JSON
echo json_encode([
    "success" => true,
    "data" => $readers
]);
    exit;
// Đóng kết nối
pg_close($conn); // Đóng kết nối cơ sở dữ liệu
?>


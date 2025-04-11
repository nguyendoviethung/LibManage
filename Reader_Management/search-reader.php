<?php
header('Content-Type: application/json; charset=utf-8');
include '../Auth/connect.php'; // Kết nối đến cơ sở dữ liệu
if (!$conn) {
    echo json_encode(["error" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}
// Đọc dữ liệu JSON từ client
$data = json_decode(file_get_contents('php://input'), true);
$studentID = $data['searchStudentID'] ?? ''; //Gán biến $studentID bằng $data['studentID'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.
$query = "SELECT * FROM reader WHERE student_id = $1"; // Truy vấn SQL để tìm kiếm sinh viên theo mã số sinh viên
$checkQuery = pg_query_params($conn,$query,[$studentID]); // Thực hiện truy vấn với tham số $studentID
if (pg_num_rows($checkQuery) > 0) { // Nếu có kết quả trả về
    $row = pg_fetch_assoc($checkQuery); // Lấy kết quả đầu tiên
    echo json_encode(['success' => true, 'data' => $row]); // Trả về dữ liệu sinh viên dưới dạng JSON
} else {
    echo json_encode(['success' => false, 'message' => 'Không tìm thấy sinh viên với mã số này.']); // Nếu không tìm thấy sinh viên
}
    exit;
// Đóng kết nối
pg_close($conn); // Đóng kết nối cơ sở dữ liệu
?>
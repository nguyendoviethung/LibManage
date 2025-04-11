<?php
header('Content-Type: application/json; charset=utf-8');
include '../Auth/connect.php'; // Kết nối đến cơ sở dữ liệu

if (!$conn) {
    echo json_encode(["success" => false, "message" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$studentID = $data['studentID'] ?? '';
$name = $data['name'] ?? '';
$email = $data['email'] ?? '';
$phone = $data['phoneNumber'] ?? '';
$faculty = $data['faculty'] ?? '';
$status = $data['status'] ?? '';

// 1. Kiểm tra email đã tồn tại ở sinh viên khác chưa
$queryEmail = "SELECT 1 FROM reader WHERE email = $1 AND student_id != $2";
$resEmail = pg_query_params($conn, $queryEmail, [$email, $studentID]);
if (pg_num_rows($resEmail) > 0) {
    echo json_encode(['success' => false, 'message' => '❗Email đã tồn tại.']);
    pg_close($conn);
    exit;
}

// 2. Kiểm tra SĐT đã tồn tại ở sinh viên khác chưa
$queryPhone = "SELECT 1 FROM reader WHERE phone_number = $1 AND student_id != $2";
$resPhone = pg_query_params($conn, $queryPhone, [$phone, $studentID]);
if (pg_num_rows($resPhone) > 0) {
    echo json_encode(['success' => false, 'message' => '❗Số điện thoại đã tồn tại.']);
    pg_close($conn);
    exit;
}

// 3. Kiểm tra nếu đổi mã số sinh viên mà bị trùng người khác
$queryMSV = "SELECT 1 FROM reader WHERE student_id = $1 AND full_name != $2";
$resMSV = pg_query_params($conn, $queryMSV, [$studentID, $name]);
if (pg_num_rows($resMSV) > 0) {
    echo json_encode(['success' => false, 'message' => '❗Mã số sinh viên này đã thuộc về sinh viên khác.']);
    pg_close($conn);
    exit;
}
// Kiểm tra định dạng của các trường dữ liệu
//  4. Nếu mọi thứ OK → Cập nhật
$query = "UPDATE reader 
          SET full_name = $1, student_id = $2, email = $3, phone_number = $4, faculty = $5, status = $6 
          WHERE student_id = $2";

$updateResult = pg_query_params($conn, $query, [
    $name, $studentID, $email, $phone, $faculty, $status
]);

if ($updateResult) {
    echo json_encode(['success' => true, 'message' => '✅ Cập nhật thông tin sinh viên thành công.']);
} else {
    echo json_encode(['success' => false, 'message' => '❌ Cập nhật thất bại: ' . pg_last_error()]);
}

pg_close($conn);
?>

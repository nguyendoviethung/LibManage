<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu
include '../../helpers/validation.php'; // Bao gồm các hàm kiểm tra định dang email, phoneNumber, studentID, faculty,username,password
if (!$conn) {
    echo json_encode(["error" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}

// Nhận dữ liệu từ client
$data = json_decode(file_get_contents('php://input'), true);

$newPassword = $data['password'] ?? '';
$newStatus   = $data['status'] ?? '';
$username   = $data['username'] ?? '';

// Lấy mật khẩu cũ từ DB
$query = "SELECT password FROM readeraccounts WHERE username = $1";
$checkQuery = pg_query_params($conn, $query, [$username ]);
$row = pg_fetch_assoc($checkQuery);
$oldPasswordHash = $row['password'];

// So sánh mật khẩu mới với mật khẩu cũ
if (password_verify($newPassword, $oldPasswordHash)) {
    echo json_encode(['success' => false, 'message' => 'Mật khẩu mới không được trùng với mật khẩu cũ.']);
    exit;
}

// Kiểm tra định dạng mật khẩu (giả sử bạn đã có sẵn hàm isValidPassword)
if (!isValidPassword($newPassword)) {
    echo json_encode(['success' => false, 'message' => 'Mật khẩu mới không hợp lệ!']);
    exit;
}

// Ok --> tiến hành mã hóa và cập nhật DB
$newPasswordHashed = password_hash($newPassword, PASSWORD_DEFAULT);

$updateQuery = "UPDATE readeraccounts SET password = $1, status = $2 WHERE username = $3";
$updateResult = pg_query_params($conn, $updateQuery, [$newPasswordHashed, $newStatus, $username]);

// Kiểm tra xem có lỗi trong quá trình cập nhật không
if ($updateResult) {
    echo json_encode(['success' => true, 'message' => 'Cập nhật mật khẩu và trạng thái thành công!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Lỗi khi cập nhật cơ sở dữ liệu.']);
}
?>

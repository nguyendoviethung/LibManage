<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Kết nối CSDL
include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu
include '../../helpers/validation.php'; // Bao gồm các hàm kiểm tra định dang email, phoneNumber, studentID, faculty,username,password
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}

// Lấy dữ liệu từ frontend gửi lên (dạng JSON)
$data = json_decode(file_get_contents('php://input'), true);

// Gán biến
$studentID = $data['studentID'] ?? '';
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

// Kiểm tra xem username đã tồn tại chưa
$checkUserQuery = "SELECT 1 FROM readeraccounts WHERE username = $1";
$checkUserResult = pg_query_params($conn, $checkUserQuery, [$username]);

if (pg_num_rows($checkUserResult) > 0) {
    echo json_encode(['success' => false, 'message' => 'Username đã tồn tại.']);
        pg_close($conn);
        exit;
}
//  // Kiểm tra định dạng username (tối thiểu 8 ký tự)
if (!isValidUserName($username)) {
    echo json_encode(['success' => false, 'message' => 'Username phải có ít nhất 8 ký tự, không được viết có dấu và không chứa ký tự đặc biệt.']);
    pg_close($conn);
    exit;
}
// Kiểm tra định dạng mật khẩu (tối thiểu 8 ký tự, không chứa khoảng trắng, có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt)
if(!isValidPassword($password)){
    echo json_encode(['success' => false, 'message' => 'Mật khẩu không hợp lệ với định dạng yêu cầu,vui lòng kiểm tra lại.']);
    pg_close($conn);
    exit;
}   
// Mã hóa mật khẩu trước khi lưu ( sau này nếu nếu đăng nhập thì so sánh với mật khẩu đã mã hóa này)
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Thêm tài khoản mới vào bảng
$insertQuery = "INSERT INTO readeraccounts (student_id, username, password) VALUES ($1, $2, $3)";
$result = pg_query_params($conn, $insertQuery, [$studentID, $username, $hashedPassword]);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'Tạo tài khoản thành công']);
} else {
    echo json_encode(['success' => false, 'message' => 'Có lỗi khi thêm tài khoản: ' . pg_last_error()]);
}
//Đóng kết nối
pg_close($conn);
?>

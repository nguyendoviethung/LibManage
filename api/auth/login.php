<?php
session_start();// Bắt đầu session
header('Content-Type: application/json');

// Nhận dữ liệu từ frontend
$data = json_decode(file_get_contents("php://input"), true);
$loginUsername = $data['loginUsername'];
$loginPassword = $data['loginPassword'];

// Kết nối DB
include '../../config/connect.php';
// Truy vấn kiểm tra tài khoản theo username
$query = "SELECT * FROM readeraccounts WHERE username = $1";
$result = pg_query_params($conn, $query, [$loginUsername]);
if ($row = pg_fetch_assoc($result)) {
    $hashedPassword = $row['password']; // Mật khẩu trong DB (đã hash)
    
    // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa
    if (password_verify($loginPassword , $hashedPassword)) {
        // Đăng nhập thành công → lưu session
        $_SESSION['username'] = $row['username'];
        $_SESSION['role'] = $row['role'];
        $_SESSION['student_id'] = $row['student_id'];

        // Trả về redirect URL tùy theo role
        echo json_encode([
            "success" => true,
            "redirect_url" => ".../../index.php"
              // "redirect_url" => $row['role'] === 'admin' 
            //     ? "../../admin/dashboard.php" 
            //     : "../../student/dashboard.php"
        ]);
        $query = "UPDATE readeraccounts SET last_login = NOW() WHERE username = $1";
        pg_query_params($conn, $query, [$loginUsername]);
        pg_close($conn);
        exit;
    }
}   
// Nếu không đúng hoặc không tồn tại
echo json_encode([
    "success" => false,
    "message" => "Tài khoản hoặc mật khẩu không đúng!"
]);
pg_close($conn);
?>

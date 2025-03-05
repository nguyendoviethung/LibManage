<?php
// Kết nối đến database PostgreSQL
$host = "localhost";
$port = "5432";
$dbname = "BT_cuoi_ki";
$user = "postgres";
$password = "2107";

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    die("Kết nối thất bại: " . pg_last_error());
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    if (empty($name) || empty($email) || empty($password) || empty($confirm_password)) {
        echo "Vui lòng điền đầy đủ thông tin.";
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Email không hợp lệ.";
    } elseif ($password !== $confirm_password) {
        echo "Mật khẩu xác nhận không khớp.";
    } else {
        // Kiểm tra xem email đã tồn tại chưa
        $check_email_sql = "SELECT id FROM users WHERE email = $1";
        $result = pg_query_params($conn, $check_email_sql, array($email));
        
        if (pg_num_rows($result) > 0) {
            echo "Email đã tồn tại, vui lòng sử dụng email khác.";
        } else {
            // Thêm tài khoản mới
            $hashed_password = password_hash($password, PASSWORD_DEFAULT);
            $sql = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
            $result = pg_query_params($conn, $sql, array($name, $email, $hashed_password));
            
            if ($result) {
                echo "Đăng ký thành công!";
            } else {
                echo "Lỗi: " . pg_last_error($conn);
            }
        }
    }
}

pg_close($conn);
?>

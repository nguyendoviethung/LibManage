<?php

$host = "localhost"; // Địa chỉ máy chủ
$port = "5432";      // Cổng mặc định PostgreSQL
$dbname = "LibManage"; // Tên cơ sở dữ liệu
$user = "postgres";  // Tên người dùng PostgreSQL
$password = "2107";  // Mật khẩu người dùng

try {
    // Chuỗi DSN cho PostgreSQL
    $dsn = "pgsql:host=$host;port=$port;dbname=$dbname";
    
    // Tạo kết nối PDO
    $pdo = new PDO($dsn, $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Bật chế độ báo lỗi
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Fetch dạng mảng kết hợp
        PDO::ATTR_EMULATE_PREPARES => false // Dùng prepared statement thật của PostgreSQL
    ]);

} catch (PDOException $e) {
    die("Kết nối thất bại: " . $e->getMessage());
}
?>

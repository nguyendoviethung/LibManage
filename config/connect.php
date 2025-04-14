<?php
// Kết nối đến database PostgreSQL
$host = "localhost"; // Địa chỉ máy chủ PostgreSQL
$port = "5432";  // Cổng mặc định của PostgreSQL
$dbname = "LibManage"; // Tên cơ sở dữ liệu
$user = "postgres";
$password ="2107";

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    die("Kết nối thất bại: " . pg_last_error());
}
?>

<?php
// Kết nối đến cơ sở dữ liệu
header('Content-Type: application/json');
include '../../config/connect.php'; // Kết nối đến cơ sở dữ liệu

$query = "SELECT status, COUNT(*) as quantity FROM readeraccounts group by status";
$result = pg_query($conn, $query);
$users_data = pg_fetch_all($result);
// Chuyển đổi dữ liệu thành định dạng JSON

echo json_encode($users_data);
?>
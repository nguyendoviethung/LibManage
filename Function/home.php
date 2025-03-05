<?php
// Kết nối đến database PostgreSQL
$host = "localhost";
$port = "5432";
$dbname = "BT_cuoi_ki";
$user = "postgres";
$password = "";

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    die("Kết nối thất bại: " . pg_last_error());
}
?>

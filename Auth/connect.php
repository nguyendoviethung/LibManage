<?php
// Kết nối đến database PostgreSQL
$host = "localhost";
$port = "5432";
$dbname = "Library_Management"; 
$user = "postgres";
$password =2107;

$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$password");

if (!$conn) {
    die("Kết nối thất bại: " . pg_last_error());
}
?>

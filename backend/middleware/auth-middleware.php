<?php
require __DIR__ . '/cors.php';
require __DIR__ . '/../config/connect.php'; 
require __DIR__ . '/../helpers/verify-jwt.php';
require __DIR__ . '/../helpers/get-jwt.php';
require __DIR__ . '/auth-role.php';

$jwt = get_jwt_from_header();
$decode = verify_jwt($jwt);

?>
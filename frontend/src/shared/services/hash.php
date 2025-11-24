<?php
// file: hash_password.php

// Nhập mật khẩu cần hash
$password = "reader1234";

// Hash mật khẩu bằng thuật toán BCRYPT
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);



echo "Mật khẩu đã hash: " . $hashedPassword 


?>

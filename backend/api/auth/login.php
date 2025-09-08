<?php
require __DIR__ . '/../../middleware/cors.php';
require __DIR__ . '/../../config/connect.php'; 
require __DIR__ . '/../../helpers/create-jwt.php';

$loginUsername = $data['loginUsername'];
$loginPassword = $data['loginPassword'];

try {
    $stmt = $pdo->prepare("SELECT * FROM readeraccounts WHERE username = :username ");
    $stmt->execute(['username' => $loginUsername]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if($row['status'] !== 'Active'){
        echo json_encode([
            "success" => false,
            "message" => "Tài khoản này không được phép truy cập vào hệ thống . Vui lòng liên hệ với quản trị viên."
        ]);
        exit;
    }

    if ($row && password_verify($loginPassword, $row['password'])) {
        
        $token = create_jwt($row['student_id'],$row['username'],$row['role']);

        $updateStmt = $pdo->prepare("UPDATE readeraccounts SET last_login = NOW() WHERE username = :username");
        $updateStmt->execute(['username' => $loginUsername]);

        echo json_encode([
            "success" => true,
            "username" => $row['username'],
            "role" => $row['role'],
            "userID" => $row['student_id'],
            "status" => $row['status'],
            "token" => $token,
        ]);
        exit;
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Incorrect account or password!"
        ]);
        exit;
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Server error: " . $e->getMessage()
    ]);
    exit;
}
?>

<?php
  require __DIR__ . '/../../middleware/auth-middleware.php';
  require '../../helpers/validation.php'; 
  checkAdminRole($decode);

$newPassword = $data['password'] ?? '';
$newStatus   = $data['status'] ?? '';
$username    = $data['username'] ?? '';

try {
    // Lấy mật khẩu cũ từ DB
    $stmt = $pdo->prepare("SELECT password FROM readeraccounts WHERE username = :username");
    $stmt->execute(['username' => $username]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        echo json_encode(['success' => false, 'message' => 'Người dùng không tồn tại.']);
        exit;
    }

    $oldPasswordHash = $row['password'];

    // So sánh mật khẩu mới với mật khẩu cũ
    if (!empty($newPassword) && password_verify($newPassword, $oldPasswordHash)) {
        echo json_encode(['success' => false, 'message' => 'The new password cannot be the same as the old password ']);
        exit;
    }

    // Mã hóa mật khẩu mới
    $newPasswordHashed = password_hash($newPassword, PASSWORD_DEFAULT);

    // Cập nhật password + status
    $updateQuery = "UPDATE readeraccounts SET password = :password, status = :status WHERE username = :username";
    $stmt = $pdo->prepare($updateQuery);
    $success = $stmt->execute([
        'password' => $newPasswordHashed,
        'status'   => $newStatus,
        'username' => $username
    ]);

    if ($success) {
        echo json_encode(['success' => true, 'message' => 'Update account information successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Update failed']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'PDO Error: ' . $e->getMessage()]);
    exit;
}
?>

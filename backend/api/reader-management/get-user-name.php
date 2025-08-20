<?php
  require __DIR__ . '/../../middleware/auth-middleware.php';
  checkAdminRole($decode);
  
try {
    $studentID = $_GET['student_id'] ?? '';

    // Kiểm tra đầu vào
    if (empty($studentID)) {
        echo json_encode([
            "success" => false,
            "message" => "Thiếu mã số sinh viên."
        ]);
        exit;
    }

    // Truy vấn bằng PDO
    $sql = "SELECT username, status FROM readeraccounts WHERE student_id = :student_id";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':student_id' => $studentID]);

    $account = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$account) {
        echo json_encode([
            "success" => false,
            "message" => "Không tìm thấy tài khoản cho mã số sinh viên này."
        ]);
    } else {
        echo json_encode([
            "success" => true,
            "data" => $account
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi DB: " . $e->getMessage()
    ]);
    exit;
}

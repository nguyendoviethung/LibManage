<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
checkReaderRole($decode);

try {
    // Parse JSON
    $data = json_decode(file_get_contents("php://input"), true);

    // ===== LẤY student_id TỪ TOKEN =====
    $studentID = null;

    if (is_object($decode) && isset($decode->data)) {
        $studentID = $decode->data->id ?? $decode->data->student_id ?? null;
    } elseif (is_array($decode) && isset($decode['data'])) {
        $studentID = $decode['data']['id'] ?? $decode['data']['student_id'] ?? null;
    }

    if (!$studentID) {
        throw new Exception("Invalid token or missing student ID");
    }

    // ===== MAP student_id -> reader_id =====
    $stmt = $pdo->prepare("
        SELECT reader_id 
        FROM reader 
        WHERE student_id = :student_id
        LIMIT 1
    ");
    $stmt->execute([':student_id' => $studentID]);
    $reader = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reader) {
        throw new Exception("Không tìm thấy reader");
    }

    $readerId = $reader['reader_id'];

    // ===== CASE 1: ĐÁNH DẤU TẤT CẢ =====
    if (!empty($data['mark_all']) && $data['mark_all'] === true) {

        $stmt = $pdo->prepare("
            UPDATE notifications
            SET is_read = TRUE
            WHERE reader_id = :reader_id
        ");
        $stmt->execute([':reader_id' => $readerId]);

        echo json_encode([
            'success' => true,
            'message' => 'Đã đánh dấu tất cả thông báo là đã đọc'
        ]);
        exit;
    }

    // ===== CASE 2: ĐÁNH DẤU 1 NOTIFICATION =====
    $notificationId = $data['notification_id'] ?? null;

    if (!$notificationId) {
        throw new Exception("Thiếu notification_id");
    }

    $stmt = $pdo->prepare("
        UPDATE notifications
        SET is_read = TRUE
        WHERE notification_id = :notification_id
          AND reader_id = :reader_id
    ");

    $stmt->execute([
        ':notification_id' => $notificationId,
        ':reader_id'       => $readerId
    ]);

    if ($stmt->rowCount() === 0) {
        throw new Exception("Không tìm thấy notification hoặc không có quyền");
    }

    echo json_encode([
        'success' => true,
        'message' => 'Đã đánh dấu thông báo là đã đọc'
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'DB Error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

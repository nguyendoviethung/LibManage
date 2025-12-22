<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
checkReaderRole($decode);

try {
    // Lấy student_id từ token (vì token chứa student_id chứ không phải reader_id)
    $studentID = null;
    
    // Thử truy cập như object
    if (is_object($decode) && isset($decode->data)) {
        $studentID = $decode->data->id ?? $decode->data->student_id ?? null;
    }
    // Thử truy cập như array
    else if (is_array($decode) && isset($decode['data'])) {
        $studentID = $decode['data']['id'] ?? $decode['data']['student_id'] ?? null;
    }

    if (!$studentID) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid token or missing student ID'
        ]);
        exit;
    }

    // Query notifications thông qua student_id
    // JOIN với bảng reader để lấy reader_id từ student_id
    $query = "
        SELECT 
            n.notification_id,
            n.reader_id,
            n.return_id,
            n.book_id,
            n.type,
            n.payload,
            n.is_read,
            n.created_at
        FROM notifications n
        INNER JOIN reader r ON n.reader_id = r.reader_id
        WHERE r.student_id = :student_id
        ORDER BY n.is_read ASC, n.created_at DESC
    ";
    
    $stmt = $pdo->prepare($query);
    $stmt->execute([':student_id' => $studentID]);
    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Decode payload từ JSONB thành array
    foreach ($notifications as &$notification) {
        if (isset($notification['payload'])) {
            $notification['payload'] = json_decode($notification['payload'], true);
        }
    }

    if ($notifications && count($notifications) > 0) {
        echo json_encode([
            'success' => true,
            'data' => $notifications
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => [],
            'message' => 'No notifications found'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database Error: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'System error: ' . $e->getMessage()
    ]);
}
?>
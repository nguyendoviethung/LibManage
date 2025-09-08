<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

checkAdminRole($decode);

try {
    $studentId = $_GET['studentId'] ?? null;

    if (!$studentId) {
        echo json_encode([
            'success' => false,
            'message' => 'Missing student ID'
        ]);
        exit;
    }

    // 1. Kiểm tra trạng thái của reader
    $sql_1 = "SELECT reader_id 
              FROM reader 
              WHERE student_id = :studentId 
              AND status = :status";
    $stmt = $pdo->prepare($sql_1);
    $stmt->execute([
        ':studentId' => $studentId,
        ':status'    => 'Active'
    ]);
    $result_1 = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result_1) {
        echo json_encode([
            'success' => false,
            'message' => 'Student does not exist or library card is locked'
        ]);
        exit;
    }

    $readerID = $result_1['reader_id'];

    // 2. Kiểm tra trạng thái account (đăng nhập)
    $sql_2 = "SELECT 1 
              FROM readeraccounts
              WHERE student_id = :studentId 
              AND status = :status";
    $stmt = $pdo->prepare($sql_2);
    $stmt->execute([
        ':studentId' => $studentId,
        ':status'    => 'Active'
    ]);
    $result_2 = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$result_2) {
        echo json_encode([
            'success' => false,
            'message' => 'Student login account has been locked'
        ]);
        exit;
    }

    // 3. Kiểm tra có sách quá hạn chưa trả
    $sql_3 = "SELECT 1
              FROM borrowrecords
              WHERE reader_id = :reader_id
              AND CURRENT_DATE - due_date > 0
              AND return_date IS NULL";
    $stmt = $pdo->prepare($sql_3);
    $stmt->execute([
        ':reader_id' => $readerID
    ]);
    $result_3 = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($result_3) {
        echo json_encode([
            'success' => false,
            'message' => 'Students have overdue books that have not been returned'
        ]);
        exit;
    }

    // 4. Kiểm tra số lượng sách đang mượn vượt quá giới hạn
    $sql_4 = "SELECT COUNT(*) AS borrowed_count
              FROM borrowrecords
              WHERE reader_id = :reader_id
              AND return_date IS NULL";
    $stmt = $pdo->prepare($sql_4);
    $stmt->execute([':reader_id' => $readerID]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row && $row['borrowed_count'] >= 5) { // ví dụ giới hạn là 5 cuốn
        echo json_encode([
            'success' => false,
            'message' => 'The student has borrowed more books than allowed (maximum 5 books)'
        ]);
        exit;
    }

    // Nếu qua hết các bước kiểm tra
    echo json_encode([
        'success'   => true,
        'reader_id' => $readerID,
        'message'   => 'This student is eligible to borrow books'
    ]);
    
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'System error:' . $e->getMessage()
    ]);
}

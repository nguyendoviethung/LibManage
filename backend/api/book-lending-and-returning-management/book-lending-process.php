<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
checkAdminRole($decode);

try {
    $studentId = $data['studentId'] ?? null;
    $bookIDs   = $data['bookIDs'] ?? null;
    $readerId = $data['reader_id'] ?? null;

    if (!$data || !$studentId || !is_array($bookIDs) || !$readerId) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid data'
        ]);
        exit;
    }

    // Múi giờ và ngày giờ ở Việt Nam
    date_default_timezone_set('Asia/Ho_Chi_Minh');
    $borrowDate = date("Y-m-d H:i:s");
    $dueDate    = date("Y-m-d H:i:s", strtotime("+14 days"));
    $successCount = 0;

    // Bắt đầu transaction để đảm bảo tính toàn vẹn dữ liệu
    $pdo->beginTransaction();

    foreach ($bookIDs as $bookID) {
        // 1. Ghi vào bảng mượn sách
        $stmtBorrow = $pdo->prepare("
            INSERT INTO borrowrecords (reader_id, book_id, borrow_date, due_date)
            VALUES (:readerId, :bookId, :borrowDate, :dueDate)
        ");
        $resultBorrow = $stmtBorrow->execute([
            'readerId'   => $readerId,
            'bookId'     => $bookID,
            'borrowDate' => $borrowDate,
            'dueDate'    => $dueDate,
        ]);

        // 2. Cập nhật số lượng sách
        $stmtUpdate = $pdo->prepare("
            UPDATE books
            SET quantity = quantity - 1
            WHERE book_id = :bookId AND quantity > 0
        ");
        $resultUpdate = $stmtUpdate->execute(['bookId' => $bookID]);

        if ($resultBorrow && $resultUpdate && $stmtUpdate->rowCount() > 0) {
            $successCount++;
        }
    }

    // Commit transaction
    $pdo->commit();

    // 3. Phản hồi
    if ($successCount === count($bookIDs)) {
        echo json_encode([
            'success' => true,
            'message' => 'Borrow all the books successfully'
        ]);
    } elseif ($successCount > 0) {
        echo json_encode([
            'success' => true,
            'message' => "Borrow a part of success ($successCount/" . count($bookIDs) . ")"
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Cannot borrow any books'
        ]);
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'Database Error: ' . $e->getMessage()
    ]);
}
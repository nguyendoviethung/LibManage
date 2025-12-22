<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
checkAdminRole($decode);

if (!isset($data)) {
    $raw = file_get_contents("php://input");
    $data = json_decode($raw, true);
}

// Validate input
if (
    !$data ||
    !isset($data['readerID']) ||
    !isset($data['bookIDs']) ||
    !is_array($data['bookIDs'])
) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid data format'
    ]);
    exit;
}

$readerId = intval($data['readerID']);
$bookIDs  = array_map('intval', $data['bookIDs']);
$returnAt = date("Y-m-d H:i:s");

try {
    $pdo->beginTransaction();

    // 1) Tìm borrowrecord
    $stmtFindBorrow = $pdo->prepare("
        SELECT record_id
        FROM borrowrecords
        WHERE reader_id = :reader_id
          AND book_id   = :book_id
          AND return_date IS NULL
        ORDER BY borrow_date DESC
        LIMIT 1
    ");

    // 2) Insert vào return_records
    $stmtInsertReturn = $pdo->prepare("
        INSERT INTO return_records (record_id, reader_id, book_id, returned_at, is_reviewed)
        VALUES (:record_id, :reader_id, :book_id, :returned_at, false)
        RETURNING return_id
    ");

    // ❗ FIX QUAN TRỌNG – Update borrowrecords
    $stmtUpdateBorrow = $pdo->prepare("
        UPDATE borrowrecords
        SET return_date = :returned_at
        WHERE record_id = :record_id
    ");

    // 3) Update quantity sách
    $stmtUpdateQuantity = $pdo->prepare("
        UPDATE books
        SET quantity = quantity + 1
        WHERE book_id = :book_id
    ");

    // 4) Lấy tên sách
    $stmtGetBookTitle = $pdo->prepare("
        SELECT title FROM books WHERE book_id = :book_id
    ");

    // 5) Insert notification
    $stmtInsertNotification = $pdo->prepare("
        INSERT INTO notifications (reader_id, return_id, book_id, type, payload, is_read, created_at)
        VALUES (
            :reader_id,
            :return_id,
            :book_id,
            'request_review',
            :payload::jsonb,
            false,
            NOW()
        )
        RETURNING notification_id
    ");

    $results = [];
    $errors = [];

    foreach ($bookIDs as $bookId) {

        // 1) Find borrow record
        $stmtFindBorrow->execute([
            ':reader_id' => $readerId,
            ':book_id'   => $bookId
        ]);
        $recordId = $stmtFindBorrow->fetchColumn();

        if (!$recordId) {
            $errors[] = "No active borrow record for book $bookId";
            $results[] = ["book_id" => $bookId, "status" => "failed"];
            continue;
        }

        // 2) Insert return record
        $stmtInsertReturn->execute([
            ':record_id'   => $recordId,
            ':reader_id'   => $readerId,
            ':book_id'     => $bookId,
            ':returned_at' => $returnAt
        ]);
        $returnId = $stmtInsertReturn->fetchColumn();

        // ❗ FIX QUAN TRỌNG – cập nhật borrowrecords
        $stmtUpdateBorrow->execute([
            ':returned_at' => $returnAt,
            ':record_id'   => $recordId
        ]);

        // 3) Update quantity
        $stmtUpdateQuantity->execute([':book_id' => $bookId]);

        // 4) Lấy tên sách
        $stmtGetBookTitle->execute([':book_id' => $bookId]);
        $bookTitle = $stmtGetBookTitle->fetchColumn() ?: 'Unknown Book';

        // 5) Tạo payload JSON
        $payload = json_encode([
            'title'       => $bookTitle,
            'message'     => 'Thank you for returning the book. Please rate this book!',
            'returned_at' => $returnAt
        ]);

        // 6) Insert notification
        $stmtInsertNotification->execute([
            ':reader_id' => $readerId,
            ':return_id' => $returnId,
            ':book_id'   => $bookId,
            ':payload'   => $payload
        ]);

        $notificationId = $stmtInsertNotification->fetchColumn();

        $results[] = [
            'book_id'        => $bookId,
            'record_id'      => $recordId,
            'return_id'      => $returnId,
            'notification_id'=> $notificationId,
            'status'         => 'success'
        ];
    }

    // Nếu có lỗi trong bất kỳ cuốn nào → rollback
    if (!empty($errors)) {
        $pdo->rollBack();
        echo json_encode([
            'success' => false,
            'message' => 'Some returns failed',
            'errors'  => $errors,
            'details' => $results
        ]);
        exit;
    }

    // Commit
    $pdo->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Books returned successfully',
        'results' => $results
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) $pdo->rollBack();

    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>

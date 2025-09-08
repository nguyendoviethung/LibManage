<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
checkAdminRole($decode);

try {
    if (!isset($data['readerID']) || !isset($data['bookIDs']) || !is_array($data['bookIDs'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Missing readerID or bookIDs data'
        ]);
        exit;
    }

    $readerID = $data['readerID'];
    $bookIDs = $data['bookIDs'];
    $returnDate = date("Y-m-d H:i:s");

    $pdo->beginTransaction();
    $errors = [];

    foreach ($bookIDs as $bookId) {
        
        // 1. Cập nhật return_date trong bảng borrowrecords
        $queryReturn = "
            UPDATE borrowrecords br
            SET return_date = :return_date
            WHERE reader_id = :reader_id
            AND book_id = :book_id
            AND return_date IS NULL
        ";
        $stmt = $pdo->prepare($queryReturn);
        $resultReturn = $stmt->execute([
            ':return_date' => $returnDate,
            ':reader_id'   => $readerID,
            ':book_id'     => $bookId
        ]);

        if (!$resultReturn || $stmt->rowCount() === 0) {
            $errors[] = "Failed to update borrowrecords for ID book: $bookId";
            continue;
        }

        // 2. Cập nhật quantity trong bảng books
        $queryQuantity = "
            UPDATE books
            SET quantity = quantity + 1
            WHERE book_id = :book_id
        ";
        $stmt = $pdo->prepare($queryQuantity);
        $resultQuantity = $stmt->execute([':book_id' => $bookId]);

        if (!$resultQuantity || $stmt->rowCount() === 0) {
            $errors[] = "Unable to update quantity for book ID: $bookId";
        }
     }

    if (count($errors) === 0) {
        $pdo->commit();
        echo json_encode([
            'success' => true,
            'message' => 'Returned book successfully'
        ]);
    } else {
        $pdo->rollBack();
        echo json_encode([
            'success' => false,
            'message' => 'Some books returned unsuccessfully',
            'errors'  => $errors
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
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'message' => 'System error: ' . $e->getMessage()
    ]);
}

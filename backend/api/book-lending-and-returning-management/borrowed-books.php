<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
checkAdminRole($decode);

try {
    
    $studentID = $_GET['studentID'] ?? null;
    if (!$studentID) {
        echo json_encode([
            'success' => false,
            'message' => 'Thiếu studentID'
        ]);
        exit;
    }
    // Truy vấn lấy sách đang mượn
    $query = "
        SELECT br.book_id, b.title, br.reader_id AS reader_id
        FROM borrowrecords br
        JOIN reader r ON br.reader_id = r.reader_id
        JOIN books b ON br.book_id = b.book_id
        WHERE r.student_id = :studentID
        AND br.return_date IS NULL
        AND b.is_deleted = false
      ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([':studentID' => $studentID]);
    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($books && count($books) > 0) {
        echo json_encode([
            'success' => true,
            'data' => $books,
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Không có sách nào được mượn'
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi CSDL: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi hệ thống: ' . $e->getMessage()
    ]);
}
?>

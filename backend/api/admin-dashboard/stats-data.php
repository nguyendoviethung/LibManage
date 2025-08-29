<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

// Kiểm tra quyền admin
checkAdminRole($decode);

try {
    // 1. Tổng số sách trong thư viện (chỉ tính sách chưa xóa)
    $stmt1 = $pdo->prepare("
        SELECT SUM(quantity) AS total_books
        FROM books
        WHERE is_deleted = :status
    ");
    $stmt1->bindValue(':status', false, PDO::PARAM_BOOL);
    $stmt1->execute();
    $total_books = $stmt1->fetch(PDO::FETCH_ASSOC);

    // 2. Số lượng độc giả Active, loại bỏ admin "AdminLibGCUT"
    $stmt2 = $pdo->prepare("
        SELECT COUNT(*) AS total_readers
        FROM reader
        WHERE status = 'Active' AND student_id != :admin_id
    ");
    $stmt2->execute(['admin_id' => 'AdminLibGCUT']);
    $total_readers = $stmt2->fetch(PDO::FETCH_ASSOC);

    // 3. Số lượng sách đang được mượn (return_date IS NULL), chỉ tính sách chưa xóa
    $stmt3 = $pdo->prepare("
        SELECT COUNT(*) AS total_borrowed_books
        FROM borrowrecords br
        JOIN books b ON br.book_id = b.book_id
        WHERE br.return_date IS NULL AND b.is_deleted = :status
    ");
    $stmt3->bindValue(':status', false, PDO::PARAM_BOOL);
    $stmt3->execute();
    $total_borrowed_books = $stmt3->fetch(PDO::FETCH_ASSOC);

    // 4. Số lượng sách quá hạn, chỉ tính sách chưa xóa
    $stmt4 = $pdo->prepare("
        SELECT COUNT(*) AS total_overdue_books
        FROM borrowrecords br
        JOIN books b ON br.book_id = b.book_id
        WHERE br.return_date IS NULL
          AND br.due_date < NOW()
          AND b.is_deleted = :status
    ");
    $stmt4->bindValue(':status', false, PDO::PARAM_BOOL);
    $stmt4->execute();
    $total_overdue_books = $stmt4->fetch(PDO::FETCH_ASSOC);

    // Trả dữ liệu JSON
    echo json_encode([
        "status" => "success",
        "data" => [
            'totalBooks' => $total_books['total_books'] ?? 0,
            'totalReaders' => $total_readers['total_readers'] ?? 0,
            'borrowedBooks' => $total_borrowed_books['total_borrowed_books'] ?? 0,
            'overdueBooks' => $total_overdue_books['total_overdue_books'] ?? 0
        ]
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database query error: " . $e->getMessage()
    ]);
}

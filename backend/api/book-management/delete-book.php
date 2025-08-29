<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

checkAdminRole($decode);

try {
    
    $bookID = $data['book_id'] ?? null;

    // Kiểm tra dữ liệu đầu vào
    if (!$bookID) {
        echo json_encode([
            'success' => false,
            'message' => 'Missing book_id to delete'
        ]);
        exit;
    }

    // Thay vì xóa sách thật sự, ta đánh dấu is_deleted = true
    $query = "UPDATE books SET is_deleted = true WHERE book_id = :book_id";
    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([':book_id' => $bookID]);

    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Delete book successfully'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Cannot delete book'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database Error: ' . $e->getMessage()
    ]);
}

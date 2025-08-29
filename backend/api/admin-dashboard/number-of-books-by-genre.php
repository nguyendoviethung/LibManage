<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

checkAdminRole($decode);

try {
    // Truy vấn lấy số lượng sách theo thể loại, chỉ tính sách chưa bị xóa
    $query = "
        SELECT genre, COUNT(*) AS total_books
        FROM books
        WHERE is_deleted = :status
        GROUP BY genre
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':status', false, PDO::PARAM_BOOL); // chỉ lấy sách chưa xóa
    $stmt->execute();

    $books_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "data" => $books_data ?: []
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database query error: " . $e->getMessage()
    ]);
}

<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

checkAdminRole($decode);

try {
    // Lấy 5 cuốn sách được mượn nhiều nhất, chỉ tính sách chưa bị xóa
    $query = "
        SELECT 
            b.title,
            b.author_name,
            COUNT(br.book_id) AS times
        FROM borrowrecords br
        JOIN books b ON br.book_id = b.book_id
        WHERE b.is_deleted = :status
        GROUP BY br.book_id, b.title, b.author_name
        ORDER BY times DESC
        LIMIT 5
    ";

    $stmt = $pdo->prepare($query);
    $stmt->bindValue(':status', false, PDO::PARAM_BOOL); // chỉ lấy sách chưa xóa
    $stmt->execute();

    $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$books) {
        echo json_encode([
            "status" => "error",
            "message" => "No books borrowed"
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "data" => $books
        ]);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database query error: " . $e->getMessage()
    ]);
}

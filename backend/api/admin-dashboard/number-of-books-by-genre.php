<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

 checkAdminRole($decode);

    try {
        // Truy vấn lấy số lượng sách theo thể loại
        $query = "
            SELECT genre, COUNT(*) AS total_books
            FROM books
            GROUP BY genre
        ";

        $stmt = $pdo->query($query);
        $books_data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            "status" => "success",
            "data" => $books_data ?: []
        ]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Lỗi truy vấn cơ sở dữ liệu: " . $e->getMessage()
        ]);
    }

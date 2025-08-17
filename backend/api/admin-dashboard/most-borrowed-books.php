<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

 checkAdminRole($decode);

    try {
        // Lấy 5 cuốn sách được mượn nhiều nhất
        $query = "
            SELECT 
                b.title,
                b.author_name,
                COUNT(br.book_id) AS times
            FROM borrowrecords br
            JOIN books b ON br.book_id = b.book_id
            GROUP BY br.book_id, b.title, b.author_name
            ORDER BY times DESC
            LIMIT 5
        ";

        $stmt = $pdo->query($query);
        $books = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$books) {
            echo json_encode([
                "status" => "error",
                "message" => "Không có sách được mượn"
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
            "message" => "Lỗi truy vấn cơ sở dữ liệu: " . $e->getMessage()
        ]);
    }

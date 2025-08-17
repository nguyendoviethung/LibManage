<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

 checkAdminRole($decode);

    try {
        // Lấy 5 cuốn sách có số lượng nhiều nhất
        $query = "
            SELECT title, author_name, quantity
            FROM public.books
            ORDER BY quantity DESC
            LIMIT 5
        ";

        $stmt = $pdo->query($query);
        $new_books = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$new_books) {
            echo json_encode([
                "status" => "error",
                "message" => "Không có sách mới được thêm"
            ]);
        } else {
            echo json_encode([
                "status" => "success",
                "data" => $new_books
            ]);
        }
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Lỗi truy vấn cơ sở dữ liệu: " . $e->getMessage()
        ]);
    }


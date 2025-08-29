<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

// Kiểm tra quyền admin
checkAdminRole($decode);

try {
    // Chuẩn bị truy vấn: lấy 5 cuốn sách có số lượng nhiều nhất, không bị xóa
    $query = "
        SELECT title, author_name, quantity
        FROM public.books
        WHERE is_deleted = :status
        ORDER BY quantity DESC
        LIMIT 5
    ";

    $stmt = $pdo->prepare($query);

    // Gán giá trị boolean false cho is_deleted
    $stmt->bindValue(':status', false, PDO::PARAM_BOOL);

    // Thực thi truy vấn
    $stmt->execute();

    // Lấy dữ liệu
    $new_books = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Trả JSON
    if (!$new_books) {
        echo json_encode([
            "status" => "error",
            "message" => "No new books added"
        ]);
    } else {
        echo json_encode([
            "status" => "success",
            "data" => $new_books
        ]);
    }
} catch (PDOException $e) {
    // Xử lý lỗi
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Database query error: " . $e->getMessage()
    ]);
}

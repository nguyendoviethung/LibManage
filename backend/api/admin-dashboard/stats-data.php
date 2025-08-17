<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

checkAdminRole($decode);

    try {
        // Lấy số lượng cuốn sách trong thư viện
        $stmt1 = $pdo->query("SELECT SUM(quantity) AS total_books FROM books;");
        $total_books = $stmt1->fetch(PDO::FETCH_ASSOC);

        // Lấy số lượng độc giả đang mượn sách từ thư viện
        $stmt2 = $pdo->query("SELECT COUNT(*) AS total_readers FROM reader WHERE status = 'Active';");
        $total_readers = $stmt2->fetch(PDO::FETCH_ASSOC);

        // Lấy số lượng sách đang được mượn
        $stmt3 = $pdo->query("SELECT COUNT(*) AS total_borrowed_books FROM borrowrecords WHERE return_date IS NULL;");
        $total_borrowed_books = $stmt3->fetch(PDO::FETCH_ASSOC);

        // Lấy số lượng sách quá hạn
        $stmt4 = $pdo->query("SELECT COUNT(*) AS total_overdue_books FROM borrowrecords WHERE return_date IS NULL AND due_date < NOW();");
        $total_overdue_books = $stmt4->fetch(PDO::FETCH_ASSOC);

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
            "message" => "Lỗi truy vấn cơ sở dữ liệu: " . $e->getMessage()
        ]);
    }

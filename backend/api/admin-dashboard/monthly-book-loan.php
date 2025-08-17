<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

 checkAdminRole($decode);

    try {
        $query = "
            SELECT 
                TO_CHAR(borrow_date, 'YYYY-MM') AS month,
                COUNT(*) AS count
            FROM borrowrecords
            WHERE borrow_date >= date_trunc('month', CURRENT_DATE) - INTERVAL '12 months'
              AND borrow_date <= date_trunc('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day'
            GROUP BY month
            ORDER BY month
        ";

        $stmt = $pdo->query($query);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Nếu không có dữ liệu thì trả về mảng rỗng
        if (!$data) {
            $data = [];
        }

        echo json_encode([
            "status" => "success",
            "data" => $data
        ]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Lỗi truy vấn cơ sở dữ liệu: " . $e->getMessage()
        ]);
    }


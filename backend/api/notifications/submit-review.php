<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
checkReaderRole($decode);

try {
    $data = json_decode(file_get_contents("php://input"), true);

    $returnId = $data['return_id'] ?? null;
    $bookId   = $data['book_id'] ?? null;
    $comment  = isset($data['comment']) ? trim($data['comment']) : null;
    $rating   = isset($data['rating']) ? (int)$data['rating'] : null;

    if (!$returnId || !$bookId || !$comment) {
        echo json_encode([
            'success' => false,
            'message' => 'Thiếu dữ liệu đánh giá'
        ]);
        exit;
    }

    if ($rating !== null && ($rating < 1 || $rating > 5)) {
        echo json_encode([
            'success' => false,
            'message' => 'Rating phải từ 1 đến 5'
        ]);
        exit;
    }

    // ===== LẤY student_id TỪ TOKEN =====
    $studentID = $decode->data->id ?? $decode->data->student_id ?? null;
    if (!$studentID) {
        throw new Exception("Invalid token");
    }

    // ===== MAP student_id -> reader_id =====
    $stmt = $pdo->prepare("
        SELECT reader_id 
        FROM reader 
        WHERE student_id = :student_id
        LIMIT 1
    ");
    $stmt->execute([':student_id' => $studentID]);
    $reader = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$reader) {
        throw new Exception("Không tìm thấy reader");
    }

    $readerId = $reader['reader_id'];

    // ===== CHỈ INSERT – KHÔNG UPDATE =====
    $stmt = $pdo->prepare("
        INSERT INTO reviews (return_id, reader_id, book_id, rating, comment)
        VALUES (:return_id, :reader_id, :book_id, :rating, :comment)
    ");

    $stmt->execute([
        ':return_id' => $returnId,
        ':reader_id' => $readerId,
        ':book_id'   => $bookId,
        ':rating'    => $rating,
        ':comment'   => $comment
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Đánh giá thành công'
    ]);

} catch (PDOException $e) {

    // Trùng return_id → đã review rồi
    if ($e->getCode() === '23505') {
        http_response_code(409);
        echo json_encode([
            'success' => false,
            'message' => 'Lần trả sách này đã được đánh giá'
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'DB Error: ' . $e->getMessage()
        ]);
    }

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

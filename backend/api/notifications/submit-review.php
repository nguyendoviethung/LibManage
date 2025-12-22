<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

checkReaderRole($decode);

try {

    // Lấy JSON từ frontend
    $data = json_decode(file_get_contents("php://input"), true);

    $returnId = $data['return_id'] ?? null;
    $bookId   = $data['book_id'] ?? null;
    $comment  = isset($data['comment']) ? trim($data['comment']) : null;
    $rating   = isset($data['rating']) ? (int)$data['rating'] : 1;
    // Validate rating range if provided
    if ($rating !== null && ($rating < 1 || $rating > 5)) {
        echo json_encode([
            'success' => false,
            'message' => 'Đánh giá phải từ 1 đến 5 sao'
        ]);
        exit;
    }

    if (!$returnId || !$bookId) {
        echo json_encode([
            'success' => false,
            'message' => 'Thiếu dữ liệu đánh giá'
        ]);
        exit;
    }

    // Lấy student_id từ JWT (token chứa student_id chứ không phải reader_id)
    $studentID = null;
    
    // Thử truy cập như object
    if (is_object($decode) && isset($decode->data)) {
        $studentID = $decode->data->id ?? $decode->data->student_id ?? null;
    }
    // Thử truy cập như array
    else if (is_array($decode) && isset($decode['data'])) {
        $studentID = $decode['data']['id'] ?? $decode['data']['student_id'] ?? null;
    }

    if (!$studentID) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid token or missing student ID'
        ]);
        exit;
    }

    // Query để lấy reader_id từ student_id
    $readerQuery = "SELECT reader_id FROM reader WHERE student_id = :student_id LIMIT 1";
    $readerStmt = $pdo->prepare($readerQuery);
    $readerStmt->execute([':student_id' => $studentID]);
    $readerRow = $readerStmt->fetch(PDO::FETCH_ASSOC);

    if (!$readerRow || !isset($readerRow['reader_id'])) {
        echo json_encode([
            'success' => false,
            'message' => 'Không tìm thấy reader_id cho student_id này'
        ]);
        exit;
    }

    $readerId = $readerRow['reader_id'];

    // Kiểm tra xem review đã tồn tại chưa
    $checkQuery = "SELECT review_id, rating, comment FROM reviews WHERE return_id = :return_id";
    $checkStmt = $pdo->prepare($checkQuery);
    $checkStmt->execute([':return_id' => $returnId]);
    $existingReview = $checkStmt->fetch();

    if ($existingReview) {
        // UPDATE: Chỉ cập nhật các trường được cung cấp
        $updateFields = [];
        $params = [':return_id' => $returnId];
        
        if ($rating !== null) {
            $updateFields[] = "rating = :rating";
            $params[':rating'] = $rating;
        }
        
        if ($comment !== null && $comment !== '') {
            $updateFields[] = "comment = :comment";
            $params[':comment'] = $comment;
        }
        
        if (empty($updateFields)) {
            echo json_encode([
                'success' => false,
                'message' => 'Không có dữ liệu để cập nhật'
            ]);
            exit;
        }
        
        $query = "UPDATE reviews SET " . implode(', ', $updateFields) . " WHERE return_id = :return_id";
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute($params);
    } else {
        // INSERT: Tạo review mới - cần ít nhất comment hoặc rating
        if (!$comment && $rating === null) {
            echo json_encode([
                'success' => false,
                'message' => 'Vui lòng nhập nhận xét hoặc đánh giá sao'
            ]);
            exit;
        }
        
        $query = "
            INSERT INTO reviews (return_id, reader_id, book_id, rating, comment)
            VALUES (:return_id, :reader_id, :book_id, :rating, :comment)
        ";
        $stmt = $pdo->prepare($query);
        $result = $stmt->execute([
            ':return_id' => $returnId,
            ':reader_id' => $readerId,
            ':book_id'   => $bookId,
            ':rating'    => $rating,
            ':comment'   => $comment
        ]);
    }

    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => 'Đánh giá thành công'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Không thể lưu đánh giá'
        ]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'DB Error: ' . $e->getMessage()
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

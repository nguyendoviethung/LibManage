<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

checkAdminRole($decode);

try {

    $bookId   = $data['book_id'] ?? null; // bắt buộc
    $title    = $data['title'] ?? '';
    $author   = $data['author_name'] ?? '';
    $language = $data['lang'] ?? '';
    $year     = $data['publisher_year'] ?? '';
    $location = $data['location'] ?? '';
    $genre    = $data['genre'] ?? '';
    $quantity = (is_numeric($data['quantity']) && $data['quantity'] !== '') ? (int)$data['quantity'] : null;

    if (!$bookId) {
        echo json_encode(['success' => false, 'message' => 'Thiếu book_id để cập nhật.']);
        exit;
    }

    // Câu lệnh UPDATE
    $query = "
        UPDATE books 
        SET 
            title = :title,
            author_name = :author,
            lang = :lang,
            publisher_year = :year,
            location = :location,
            genre = :genre,
            quantity = :quantity
        WHERE book_id = :book_id
    ";

    $stmt = $pdo->prepare($query);
    $result = $stmt->execute([
        ':title'    => $title,
        ':author'   => $author,
        ':lang'     => $language,
        ':year'     => $year,
        ':location' => $location,
        ':genre'    => $genre,
        ':quantity' => $quantity,
        ':book_id'  => $bookId
    ]);

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'Chỉnh sửa thành công']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Không có thay đổi hoặc lỗi khi cập nhật']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Lỗi DB: ' . $e->getMessage()]);
}

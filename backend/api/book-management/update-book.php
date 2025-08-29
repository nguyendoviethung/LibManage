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
        echo json_encode(['success' => false, 'message' => 'Missing book_id to update.']);
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
        echo json_encode(['success' => true, 'message' => 'Successful book editing']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No changes or errors when updating']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()]);
}

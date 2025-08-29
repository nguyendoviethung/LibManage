<?php
require __DIR__ . '/../../middleware/auth-middleware.php';

checkAdminRole($decode);

try {

    $title    = $data['title'] ?? null;
    $author   = $data['author_name'] ?? null;
    $language = $data['lang'] ?? null;
    $year     = $data['publisher_year'] ?? null;
    $location = $data['location'] ?? null;
    $genre    = $data['genre'] ?? null;
    $quantity = $data['quantity'] ?? null;

    // Kiểm tra dữ liệu hợp lệ
    if ($title && $author && $language && $year && $location && $genre && $quantity) {

        // Truy vấn để thêm sách vào cơ sở dữ liệu
        $query = "INSERT INTO books (title, author_name, lang, publisher_year, location, genre, quantity) 
                  VALUES (:title, :author, :lang, :year, :location, :genre, :quantity)";

        $stmt = $pdo->prepare($query);
        $result = $stmt->execute([
            ':title'    => $title,
            ':author'   => $author,
            ':lang'     => $language,
            ':year'     => $year,
            ':location' => $location,
            ':genre'    => $genre,
            ':quantity' => $quantity
        ]);

        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Book has been added']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Unable to add book']);
        }

    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid data']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
}

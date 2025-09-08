    <?php 
    require __DIR__ . '/../../middleware/auth-middleware.php';
    checkAdminRole($decode);

    try {
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $search = $_GET['search'] ?? '';
    $category = $_GET['category'] ?? '';
    $author = $_GET['author'] ?? '';
    $year = $_GET['year'] ?? '';
    $lang = $_GET['lang'] ?? '';
    $sortKey = !empty($_GET['sortKey']) ? $_GET['sortKey'] : 'book_id';
    $sortOrder = strtoupper($_GET['sortOrder'] ?? 'ASC');
    $sortOrderSafe = ($sortOrder === 'DESC') ? 'DESC' : 'ASC';

        // Điều kiện WHERE
        $where = ["is_deleted = :is_deleted"];
        $params = [":is_deleted" => 'false'];
    
if ($search && $search !== '') {
    $where[] = "(LOWER(title) LIKE LOWER(:search) 
                 OR LOWER(author_name) LIKE LOWER(:search) 
                 OR LOWER(genre) LIKE LOWER(:search))";
    $params[":search"] = "%" . strtolower($search) . "%";
}

    if ($category && $category !== 'All') {
        $where[] = "genre = :genre";
        $params[":genre"] = $category;
}
    if ($author && $author !== 'All') {
        $where[] = "author_name = :author";
        $params[":author"] = $author;
}
    if ($year && $year !== 'All') {
        $where[] = "publisher_year = :year";
        $params[":year"] = $year;
}
if ($lang && $lang !== 'All') {
        $where[] = "lang = :lang";
        $params[":lang"] = $lang;
}

        $whereSql = implode(' AND ', $where);

        // Query lấy danh sách (có phân trang, sort)
        $queryBooks = "
            SELECT * FROM books 
            WHERE $whereSql 
            ORDER BY $sortKey $sortOrderSafe 
            LIMIT :limit OFFSET :offset
        ";

        $stmt = $pdo->prepare($queryBooks);
        
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }
        $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt->bindValue(":offset", ($page - 1) * $limit, PDO::PARAM_INT);
        $stmt->execute();
        $books = $stmt->fetchAll() ?: [];

      // Nếu không có bản ghi và page > 1 thì quay về trang 1
        if (empty($books) && $page > 1) {
            $page = 1;
            $stmt->bindValue(":offset", 0, PDO::PARAM_INT); // offset phải về 0
            $stmt->execute();
            $books = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
        }
        // Query đếm tổng số
        $queryCount = "SELECT COUNT(*) FROM books WHERE $whereSql";
        $stmtCount = $pdo->prepare($queryCount);
        foreach ($params as $key => $value) {
            $stmtCount->bindValue($key, $value);
        }
        $stmtCount->execute();
        $totalBooks = (int)$stmtCount->fetchColumn();

        // Query các filter option
        $authors = $pdo->query("SELECT DISTINCT author_name FROM books WHERE is_deleted = false ORDER BY author_name ASC")->fetchAll(PDO::FETCH_COLUMN);
        $years = $pdo->query("SELECT DISTINCT publisher_year FROM books WHERE is_deleted = false ORDER BY publisher_year DESC")->fetchAll(PDO::FETCH_COLUMN);
        $langs = $pdo->query("SELECT DISTINCT lang FROM books WHERE is_deleted = false ORDER BY lang ASC")->fetchAll(PDO::FETCH_COLUMN);
        $categories = $pdo->query("SELECT DISTINCT genre FROM books WHERE is_deleted = false ORDER BY genre ASC")->fetchAll(PDO::FETCH_COLUMN);

        $filterOptions = [
            'authors' => array_merge(['All'], $authors ?: []),
            'years' => array_merge(['All'], $years ?: []),
            'langs' => array_merge(['All'], $langs ?: []),
            'categories' => array_merge(['All'], $categories ?: []),
        ];

        echo json_encode([
            "success" => true,
            "data" => [
                "books" => $books,
                "total" => $totalBooks,
                "filterOptions" => $filterOptions
            ]
        ]);
    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Database Error: " . $e->getMessage()
        ]);
    }

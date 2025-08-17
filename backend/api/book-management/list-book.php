<?php 
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000'); // chính xác domain frontend
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: POST,GET');

include '../../config/connect.php';

$data = json_decode(file_get_contents('php://input'), true);
$page = isset($data['page']) ? (int)$data['page'] : 1;
$limit = isset($data['limit']) ? (int)$data['limit'] : 10;
$search = $data['search'] ?? '';
$category = $data['category'] ?? '';
$author = $data['author'] ?? '';
$year = $data['year'] ?? '';
$lang = $data['lang'] ?? '';
$sortOrder = strtoupper($data['sortOrder'] ?? 'ASC');
$sortOrderSafe = $sortOrder === 'DESC' ? 'DESC' : 'ASC';
$sortKey = $data['sortKey'] === '' ? 'book_id' : $data['sortKey'];

// Xây dựng điều kiện WHERE
$where = ["is_deleted = $1"];
$params = ['false'];
$paramIndex = 1;

if ($category && $category !== 'Tất cả') {
    $where[] = "genre = $" . ++$paramIndex;
    $params[] = $category;
}
if ($author && $author !== 'Tất cả') {
    $where[] = "author_name = $" . ++$paramIndex;
    $params[] = $author;
}
if ($year && $year !== 'Tất cả') {
    $where[] = "publisher_year = $" . ++$paramIndex;
    $params[] = $year;
}
if ($lang && $lang !== 'Tất cả') {
    $where[] = "lang = $" . ++$paramIndex;
    $params[] = $lang;
}
if ($search) {
    $where[] = "title ILIKE $" . ++$paramIndex;
    $params[] = '%' . $search . '%';
}

$whereSql = implode(' AND ', $where);

// Truy vấn danh sách sách (có phân trang, sắp xếp)
$query_1 = "SELECT * FROM books WHERE $whereSql ORDER BY $sortKey $sortOrderSafe LIMIT $" . ($paramIndex + 1) . " OFFSET $" . ($paramIndex + 2);
$params_1 = array_merge($params, [$limit, ($page - 1) * $limit]);

$result_1 = pg_query_params($conn, $query_1, $params_1);
if (!$result_1) {
    $error = pg_last_error($conn);
    echo json_encode([
        "success" => false,
        "message" => "Lỗi truy vấn danh sách: $error"
    ]);
    exit;
}

$books = pg_fetch_all($result_1);
if (!$books) $books = [];

// Truy vấn tổng số sách phù hợp (không phân trang)
$query_2 = "SELECT COUNT(*) FROM books WHERE $whereSql";
$result_2 = pg_query_params($conn, $query_2, $params);
if (!$result_2) {
    $error = pg_last_error($conn);
    echo json_encode([
        "success" => false,
        "message" => "Lỗi truy vấn đếm tổng số sách: $error"
    ]);
    exit;
}
$totalBooks = pg_fetch_result($result_2, 0, 0);

// Lấy các tùy chọn filter
$authors = pg_fetch_all_columns(pg_query($conn, "SELECT DISTINCT author_name FROM books WHERE is_deleted = 'false' ORDER BY author_name ASC"));
$years = pg_fetch_all_columns(pg_query($conn, "SELECT DISTINCT publisher_year FROM books WHERE is_deleted = 'false' ORDER BY publisher_year DESC"));
$langs = pg_fetch_all_columns(pg_query($conn, "SELECT DISTINCT lang FROM books WHERE is_deleted = 'false' ORDER BY lang ASC"));
$categories = pg_fetch_all_columns(pg_query($conn, "SELECT DISTINCT genre FROM books WHERE is_deleted = 'false' ORDER BY genre ASC"));

$filterOptions = [
    'authors' => array_merge(['Tất cả'], $authors ?: []),
    'years' => array_merge(['Tất cả'], $years ?: []),
    'langs' => array_merge(['Tất cả'], $langs ?: []),
    'categories' => array_merge(['Tất cả'], $categories ?: []),
];

// Trả về kết quả thành công
echo json_encode([
    "success" => true,
    "data" => [
        "books" => $books,
        "total" => (int)$totalBooks,
        "filterOptions" => $filterOptions
    ]
]);
?>

<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
checkAdminRole($decode);

try {
    $start_date = $_GET['start_date'] ?? null;
    $end_date   = $_GET['end_date'] ?? null;
    $page       = $_GET['page'] ?? 1;
    $limit      = $_GET['limit'] ?? 10;
    $search     = $_GET['search'] ?? '';
    $filterStatus = $_GET['status'] ?? ''; // All, Borrowed, Returned, Overdue
    $sortKey    = $_GET['sortKey'] ?? 'borrow_date';
    $sortOrder  = $_GET['sortOrder'] ?? 'DESC';

    // Bảo vệ sortKey và sortOrder
    $allowedSortKeys = ['record_id','title','full_name','student_id','borrow_date','due_date','return_date'];
    if (!in_array($sortKey, $allowedSortKeys)) $sortKey = 'borrow_date';
    $sortOrder = strtoupper($sortOrder) === 'ASC' ? 'ASC' : 'DESC';

    $baseSql = "FROM borrowrecords AS br 
                JOIN reader AS r ON br.reader_id = r.reader_id
                JOIN books AS b ON br.book_id = b.book_id
                WHERE 1=1";

    if ($start_date) $baseSql .= " AND br.borrow_date >= :start_date";
    if ($end_date)   $baseSql .= " AND br.borrow_date <= :end_date";
    if (!empty($search)) $baseSql .= " AND (r.student_id LIKE :search OR b.title LIKE :search)";

    // --- Filter trạng thái bằng CASE
    if (!empty($filterStatus) && $filterStatus !== 'All') {
        if ($filterStatus === 'Returned') {
            $baseSql .= " AND br.return_date IS NOT NULL";
        } elseif ($filterStatus === 'Borrowed') {
            $baseSql .= " AND br.return_date IS NULL AND br.due_date >= CURRENT_DATE";
        } elseif ($filterStatus === 'Overdue') {
            $baseSql .= " AND br.return_date IS NULL AND br.due_date < CURRENT_DATE";
        }
    }

    // Count tổng
    $countSql = "SELECT COUNT(*) as total " . $baseSql;
    $countStmt = $pdo->prepare($countSql);

    if ($start_date) $countStmt->bindValue(':start_date', $start_date);
    if ($end_date)   $countStmt->bindValue(':end_date', $end_date);
    if (!empty($search)) $countStmt->bindValue(':search', "%$search%");

    $countStmt->execute();
    $totalRecords = $countStmt->fetchColumn();

    // Lấy dữ liệu phân trang (PostgreSQL: LIMIT ... OFFSET ...)
    $offset = ($page - 1) * $limit;
    $dataSql = "SELECT br.record_id, b.title, r.full_name, r.student_id,
                       br.borrow_date, br.due_date, br.return_date,
                       CASE 
                           WHEN br.return_date IS NOT NULL THEN 'Returned'
                           WHEN br.return_date IS NULL AND br.due_date < CURRENT_DATE THEN 'Overdue'
                           ELSE 'Borrowed'
                       END AS status
                " . $baseSql . " ORDER BY $sortKey $sortOrder LIMIT :limit OFFSET :offset";

    $dataStmt = $pdo->prepare($dataSql);

    if ($start_date) $dataStmt->bindValue(':start_date', $start_date);
    if ($end_date)   $dataStmt->bindValue(':end_date', $end_date);
    if (!empty($search)) $dataStmt->bindValue(':search', "%$search%");

    $dataStmt->bindValue(':limit', (int)$limit, PDO::PARAM_INT);
    $dataStmt->bindValue(':offset', (int)$offset, PDO::PARAM_INT);

    $dataStmt->execute();
    $records = $dataStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "data" => [
            "records" => $records,
            "total" => (int)$totalRecords
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi CSDL: ' . $e->getMessage()
    ]);
}

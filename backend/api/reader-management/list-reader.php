    <?php
    require __DIR__ . '/../../middleware/auth-middleware.php';
    checkAdminRole($decode);

    try {

        $page       = isset($_GET['page']) ? (int)$_GET['page'] : 1;
        $limit      = isset($_GET['limit']) ? (int)$_GET['limit'] : 8;
        $search     = isset($_GET['search']) ? trim($_GET['search']) : '';
        $faculty    = isset($_GET['faculty']) ? trim($_GET['faculty']) : '';
        $status     = isset($_GET['status']) ? trim($_GET['status']) : '';
        $sortKey    = isset($_GET['sortKey']) ? $_GET['sortKey'] : 'reader_id';
        $sortOrder  = isset($_GET['sortOrder']) ? strtoupper($_GET['sortOrder']) : 'ASC';

        $allowedSortKeys = ['reader_id', 'full_name', 'faculty', 'status']; // whitelist cột cho phép sort
        if (!in_array($sortKey, $allowedSortKeys)) {
            $sortKey = 'reader_id';
        }
        $sortOrder = ($sortOrder === 'DESC') ? 'DESC' : 'ASC';

        $where  = ["student_id <> :id"];
        $params = [":id" => "AdminLibGCUT"];


        if ($search !== '') {
            $where[] = "(full_name ILIKE :search OR student_id ILIKE :search)";
            $params[":search"] = "%" . $search . "%";
        }

        if ($faculty !== '' && $faculty !== 'All') {
            $where[] = "faculty = :faculty";
            $params[":faculty"] = $faculty;
        }

        if ($status !== '' && $status !== 'All') {
            $where[] = "status = :status";
            $params[":status"] = $status;
        }

        $whereSql = "";
        if (!empty($where)){
        $whereSql = "WHERE " . implode(" AND ", $where);
        }
        // Lấy danh sách reader theo trang tương ứng cùng với các options đẫ chọn
        $query_1 = "
            SELECT *, COUNT(*) OVER() AS total_count 
            FROM reader
            $whereSql
            ORDER BY $sortKey $sortOrder
            LIMIT :limit OFFSET :offset
            ";

        $stmt_1 = $pdo->prepare($query_1);
        foreach ($params as $key => $value) {
            $stmt_1->bindValue($key, $value);
        }

        $stmt_1->bindValue(":limit", $limit, PDO::PARAM_INT);
        $stmt_1->bindValue(":offset", ($page - 1) * $limit, PDO::PARAM_INT);
        $stmt_1->execute();
        $readers = $stmt_1->fetchAll(PDO::FETCH_ASSOC);

    // Faculties
    $query_2 = "
    SELECT DISTINCT faculty
    FROM reader
    WHERE student_id <> :id
    ";
    $stmt_3 = $pdo->prepare($query_2);
    $stmt_3->bindValue(":id", "AdminLibGCUT", PDO::PARAM_STR);
    $stmt_3->execute();
    $faculties = $stmt_3->fetchAll(PDO::FETCH_COLUMN);

        echo json_encode([
            "success" => true,
            "data" => $readers,
            "filterOptions" => [
            "faculties" => array_merge(['All'], $faculties ?: []),
            "statuses"  => array_merge(['All'], ['Active','Inactive','Banned']),
            ]
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            "success" => false,
            "message" => "Lỗi truy vấn dữ liệu: " . $e->getMessage()
        ]);
        exit;
    }

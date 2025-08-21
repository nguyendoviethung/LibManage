<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
require __DIR__ . '/../../helpers/validation.php';
checkAdminRole($decode);

try {
    $studentID      = $data['student_id'];
    $newName        = $data['full_name'];
    $newEmail       = $data['email'];
    $newPhone       = $data['phone_number'];
    $newFaculty     = $data['faculty'];
    $newStatus      = $data['status'];
    // $valueCheckBox = filter_var($data['keepAccountStatus'] ?? false, FILTER_VALIDATE_BOOLEAN);    
     $valueCheckBox = $data['keepAccountStatus'];  
    // I. VALIDATION
    // ============================
    // Kiểm tra trùng số điện thoại
    $stmt = $pdo->prepare("SELECT 1 FROM reader WHERE phone_number = :phone AND student_id != :student_id");
    $stmt->execute([':phone' => $newPhone, ':student_id' => $studentID]);

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => '❗Số điện thoại đã tồn tại.']);
        exit;
    }

    if (!isValidPhoneNumber($newPhone)) {
        echo json_encode(['success' => false, 'message' => '❗Số điện thoại không hợp lệ.']);
        exit;
    }

    if (!isValidFaculty($newFaculty)) {
        echo json_encode(['success' => false, 'message' => '❗Khoa không hợp lệ.']);
        exit;
    }

    // ============================
    // II. UPDATE DATA
    // ============================
    $pdo->beginTransaction();

    // Update reader info
    $sql = "UPDATE reader 
            SET full_name = :name, email = :email, phone_number = :phone, faculty = :faculty, status = :status 
            WHERE student_id = :student_id";
    $stmt = $pdo->prepare($sql);
    $updateResult = $stmt->execute([
        ':name'       => $newName,
        ':email'      => $newEmail,
        ':phone'      => $newPhone,
        ':faculty'    => $newFaculty,
        ':status'     => $newStatus,
        ':student_id' => $studentID
    ]);

  $mapStatus = [
    'Inactive' => 'Disabled',
    'Banned'   => 'Banned',
    'Active'   => 'Active'
];

    // Nếu tick checkbox → đồng bộ trạng thái tài khoản
    $updateStatusResult = true;
    if ($valueCheckBox) {
        $accountStatus = $mapStatus[$newStatus] ?? 'Active';
        $sqlAcc = "UPDATE readeraccounts SET status = :accStatus WHERE student_id = :student_id";
        $stmtAcc = $pdo->prepare($sqlAcc);
        $updateStatusResult = $stmtAcc->execute([
            ':accStatus'   => $accountStatus,
            ':student_id'  => $studentID
        ]);
    }
    
    $autoEmailForwarding = true;
    $query = "UPDATE readeraccounts 
              SET username = :username
              WHERE student_id = :student_id";
    $stmt = $pdo->prepare($query);
    $autoEmailForwarding = $stmt->execute([
        ':username'   => $newEmail,
        ':student_id' => $studentID
    ]);
    
    if ($updateResult && $updateStatusResult && $autoEmailForwarding ) {
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => '✅ Cập nhật thông tin sinh viên thành công.']);
    } else {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => '❌ Cập nhật thất bại.']);
    }

} catch (PDOException $e) {
    if ($pdo->inTransaction())
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => '❌ Lỗi DB: ' . $e->getMessage()]);
    exit;
}

<?php
  require __DIR__ . '/../../middleware/auth-middleware.php';
  checkReaderRole($decode);

try {
   $student_id = $decode->data->id;
   $query = "SELECT chat_id , admin_id 
             FROM chats
             WHERE student_id = :student_id
            ";
   $stmt = $pdo->prepare($query);
   $stmt->execute([':student_id' => $student_id]);
   $row = $stmt->fetch(PDO::FETCH_ASSOC);
  if (!$row) {
    $query = "INSERT INTO chats (student_id, admin_id, created_at) 
              VALUES (:student_id, :admin_id, :created_at)";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':student_id' => $student_id,
        ':admin_id'   => "AdminLib2025",
        ':created_at' => date('Y-m-d H:i:s')
    ]);

    echo json_encode(['success' => true, 'message' => 'Chat created successfully']);
    exit;
} else {
    $query = "SELECT full_name FROM reader WHERE student_id = :student_id";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
          ':student_id' => $student_id
    ]);    
    $row_1 = $stmt->fetch(PDO::FETCH_ASSOC);

    $query = "SELECT message_text AS text,sender_type 
              FROM messages
              WHERE chat_id = :chat_id";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':chat_id' => $row['chat_id']
    ]);          
    $chats = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 
                      'chats' => $chats,
                      'admin_id' => "AdminLibGCUT",  // Đoạn này là cố định chat với một quản trị viên , sau này mở rộng fix lại
                      'chat_id' => $row['chat_id'],
                      'student_id' => $student_id,
                      'full_name' => $row_1['full_name'],
                    ]);
}

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'PDO Error: ' . $e->getMessage()]);
    exit;
}
?>

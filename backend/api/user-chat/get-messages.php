<?php
  require __DIR__ . '/../../middleware/auth-middleware.php';
  require '../../helpers/validation.php'; 
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

    echo json_encode(['success' => true, 'message' => 'Tạo chat thành công']);
    exit;
} else {
    $query = "SELECT sender_id, message_text 
              FROM messages
              WHERE chat_id = :chat_id";
    $stmt = $pdo->prepare($query);
    $stmt->execute([
        ':chat_id' => $row['chat_id']
    ]);          
    $chats = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 
                      'chats' => $chats,
                      'admin_id' => "AdminLib2025",
                      'chat_id' => $row['chat_id'],
                    ]);
}

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Lỗi PDO: ' . $e->getMessage()]);
    exit;
}
?>

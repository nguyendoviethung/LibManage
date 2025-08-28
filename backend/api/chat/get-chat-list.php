<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
checkAdminRole($decode); 

try {
    $adminID = $decode->data->id;

    // 1. Lấy danh sách chat + tin nhắn gần nhất
    $query = "
        SELECT 
    c.chat_id AS chat_id,
    c.student_id AS student_id,            -- ⚡ thêm student_id của người đọc
    r.full_name AS reader_name,            -- luôn là tên người đọc (chủ chat)
    
    CASE 
        WHEN m.sender_type = 'reader' THEN r.full_name
        ELSE 'Librarian'
    END AS last_sender_name,               -- tên của người gửi tin cuối
    
    m.sender_id AS sender_id,
    m.message_text AS text,
    m.sent_at AS time,
    m.is_read AS is_read
FROM chats c
JOIN reader r ON c.student_id = r.student_id
JOIN LATERAL (
    SELECT m2.message_text, m2.sent_at, m2.is_read, m2.sender_id, m2.sender_type
    FROM messages m2
    WHERE m2.chat_id = c.chat_id
    ORDER BY m2.sent_at DESC
    LIMIT 1
) m ON TRUE
WHERE c.admin_id = :admin_id
ORDER BY m.sent_at DESC;

     ";

    $stmt = $pdo->prepare($query);
    $stmt->execute([':admin_id' => $adminID]);
    $chats = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Lấy chat_id mới nhất
    $lastChatID = $chats[0]['chat_id'] ?? null;
    $lastChatMessages = [];

    if ($lastChatID) {
        $query2 = "
            SELECT m.message_id,
                   m.sender_type,
                   m.sender_id,
                   m.message_text,
                   m.sent_at,
                   m.is_read
            FROM messages m
            WHERE m.chat_id = :chat_id
            ORDER BY m.sent_at ASC
        ";
        $stmt2 = $pdo->prepare($query2);
        $stmt2->execute([':chat_id' => $lastChatID]);
        $lastChatMessages = $stmt2->fetchAll(PDO::FETCH_ASSOC);
    }

    // Kết quả trả về
    echo json_encode([
        'success' => true,
        'chats' => $chats,                       // danh sách các chat (giống inbox FB)    
        'lastChatMessages' => $lastChatMessages // toàn bộ tin nhắn của chat mới nhất
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi CSDL: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Lỗi hệ thống: ' . $e->getMessage()
    ]);
}

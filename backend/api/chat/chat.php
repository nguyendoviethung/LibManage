<?php
require __DIR__ .'/vendor/autoload.php';
require __DIR__ .'/config/connect.php'; 
require __DIR__ .'/config/decode_jwt.php';

use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

class ChatServer implements MessageComponentInterface {
    protected $clients;
    protected $users; // Lưu user_id => connection
    protected $pdo;

    public function __construct($pdo) {
        $this->clients = new \SplObjectStorage;
        $this->users = [];
        $this->pdo = $pdo;
        echo "WebSocket Server started...\n";
    }

    /**
     * Khi client kết nối
     */
    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    /**
     * Khi nhận message từ client
     */
    public function onMessage(ConnectionInterface $from, $msg) {
        $data = json_decode($msg, true);
        if (!$data || !isset($data['type'])) {
            $from->send(json_encode(['type'=>'error','message'=>'Invalid message format']));
            return;
        }

        switch ($data['type']) {
            case 'auth':
                $this->handleAuth($from, $data);
                break;

            case 'message':
                $this->handleMessage($from, $data);
                break;

            case 'list_chats':
                $this->handleListChats($from, $data);
                break;

            case 'create_chat':
                $this->handleCreateChat($from, $data);
                break;

            case 'delete_chat':
                $this->handleDeleteChat($from, $data);
                break;

            default:
                $from->send(json_encode(['type'=>'error','message'=>'Unknown type']));
        }
    }

    /**
     * Khi client đóng kết nối
     */
    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        foreach ($this->users as $uid => $connection) {
            if ($connection === $conn) {
                unset($this->users[$uid]);
                echo "User $uid disconnected.\n";
                break;
            }
        }
    }

    /**
     * Khi có lỗi
     */
    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }

    // ===================== Các hàm xử lý riêng =====================

    private function handleAuth($conn, $data) {
        try {
            $decoded = decode_jwt($data['token']);
            $user_id = $decoded->data->id;
            $this->users[$user_id] = $conn;
            $conn->send(json_encode(['type'=>'auth_success','user_id'=>$user_id]));
            echo "User $user_id authenticated.\n";
        } catch (\Exception $e) {
            $conn->send(json_encode(['type'=>'auth_error','message'=>$e->getMessage()]));
            $conn->close();
            echo "Auth failed: {$e->getMessage()}\n";
        }
    }

    private function handleMessage($conn, $data) {
        $sender_id = array_search($conn, $this->users);
        $receiver_id = $data['receiver_id'] ?? null;
        $text = trim($data['text'] ?? '');

        if (!$sender_id || !$receiver_id || !$text) {
            $conn->send(json_encode(['type'=>'error','message'=>'Missing sender/receiver/text']));
            return;
        }

        // Lưu tin nhắn vào DB
        try {
            $stmt = $this->pdo->prepare("
                INSERT INTO private_messages (sender_id, receiver_id, content)
                VALUES (:sender_id, :receiver_id, :content)
            ");
            $stmt->execute([
                ':sender_id' => $sender_id,
                ':receiver_id' => $receiver_id,
                ':content' => $text
            ]);
        } catch (\PDOException $e) {
            $conn->send(json_encode(['type'=>'error','message'=>'DB error: '.$e->getMessage()]));
            return;
        }

        $saved_at = date("H:i:s");

        // Gửi tới receiver nếu online
        if (isset($this->users[$receiver_id])) {
            $this->users[$receiver_id]->send(json_encode([
                'type'=>'message',
                'sender_id'=>$sender_id,
                'text'=>$text,
                'time'=>$saved_at
            ]));
        }

        // Phản hồi cho sender
        $conn->send(json_encode([
            'type'=>'message',
            'sender_id'=>$sender_id,
            'text'=>$text,
            'time'=>$saved_at
        ]));
    }

    private function handleListChats($conn, $data) {
        $user_id = array_search($conn, $this->users);
        if (!$user_id) return;

        $stmt = $this->pdo->prepare("
            SELECT DISTINCT 
                CASE WHEN sender_id=:uid THEN receiver_id ELSE sender_id END AS chat_with
            FROM private_messages
            WHERE sender_id=:uid OR receiver_id=:uid
        ");
        $stmt->execute([':uid'=>$user_id]);
        $chats = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conn->send(json_encode(['type'=>'list_chats','chats'=>$chats]));
    }

    private function handleCreateChat($conn, $data) {
        $sender_id = array_search($conn, $this->users);
        $receiver_id = $data['receiver_id'] ?? null;
        if (!$receiver_id) return;

        // Tạo chat mới chỉ cần insert tin nhắn đầu tiên hoặc để trống
        $conn->send(json_encode(['type'=>'create_chat_success','chat_with'=>$receiver_id]));
    }

    private function handleDeleteChat($conn, $data) {
        $user_id = array_search($conn, $this->users);
        $chat_with = $data['chat_with'] ?? null;
        if (!$chat_with) return;

        $stmt = $this->pdo->prepare("
            DELETE FROM private_messages
            WHERE (sender_id=:uid AND receiver_id=:other) OR (sender_id=:other AND receiver_id=:uid)
        ");
        $stmt->execute([':uid'=>$user_id, ':other'=>$chat_with]);

        $conn->send(json_encode(['type'=>'delete_chat_success','chat_with'=>$chat_with]));
    }
}

// ===================== Chạy server =====================
$port = 9000;
$server = \Ratchet\Server\IoServer::factory(
    new \Ratchet\Http\HttpServer(
        new \Ratchet\WebSocket\WsServer(
            new ChatServer($pdo)
        )
    ),
    $port
);

echo "Server running on ws://localhost:$port\n";
$server->run();

    <?php
    require __DIR__ . '/../../helpers/decode-jwt.php';
    require __DIR__ . '/../../helpers/get-jwt.php';
    require __DIR__ . '/../../config/connect.php';

    use Ratchet\MessageComponentInterface;
    use Ratchet\ConnectionInterface;

    // ===================== ChatServer =====================
    class ChatServer implements MessageComponentInterface {
        protected $clients;
        protected $users; // user_id => connection
        protected $pdo;

        public function __construct($pdo) {
            $this->clients = new \SplObjectStorage;
            $this->users   = [];
            $this->pdo     = $pdo;
            echo "WebSocket Server started...\n";
        }

        public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);

        $query = $conn->httpRequest->getUri()->getQuery();
        parse_str($query, $params);

        if (!isset($params['token'])) {
            $conn->send(json_encode(['type'=>'auth_error','message'=>'Missing token']));
            $conn->close();
            return;
        }

        try {
            $decoded = decode_jwt($params['token']);
            $user_id = $decoded->data->id;

            // mapping user_id <-> connection
            $this->users[$user_id] = $conn;

            $conn->send(json_encode(['type'=>'auth_success','user_id'=>$user_id]));
            echo "User $user_id authenticated via handshake.\n";
        } catch (\Exception $e) {
            $conn->send(json_encode(['type'=>'auth_error','message'=>$e->getMessage()]));
            $conn->close();
            echo "Auth failed in handshake: {$e->getMessage()}\n";
        }

        echo "New connection! ({$conn->resourceId})\n";
    }

        public function onMessage(ConnectionInterface $from, $msg) {
            $data = json_decode($msg, true);
            if (!$data || !isset($data['type'])) {
                $from->send(json_encode(['type'=>'error','message'=>'Invalid message format']));
                return;
            }

            switch ($data['type']) {
                case 'admin_send_message':
                    $this->handleAdminSendMessage($from, $data);
                    break;
                case 'get_message_when_changing_conversation':
                    $this->handleAdminGetMessages($from,$data);
                    break;
                case 'reader_send_message':
                    $this->handleReaderSendMessages($from,$data);
                    break;
                default:
                    $from->send(json_encode(['type'=>'error','message'=>'Unknown type']));
            }
        }

        public function onClose(ConnectionInterface $conn) {
            $this->clients->detach($conn);
            foreach ($this->users as $uid => $connection) {
                if ($connection === $conn) {
                    unset($this->users[$uid]);
                    echo " User $uid disconnected.\n";
                    break;
                }
            }
        }

        public function onError(ConnectionInterface $conn, \Exception $e) {
            echo " Error: {$e->getMessage()}\n";
            $conn->close();
        }

        // ===================== Các hàm xử lý =====================

        //1. Hàm admin gửi tin nhắn thông thường
private function handleAdminSendMessage($conn, $data) {
    $sender_id   = array_search($conn, $this->users); // user_id hiện tại
    $chat_id     = $data['chat_id'] ?? null;          // chat đang nhắn
    $message_text = trim($data['text'] ?? '');
    $sender_type = $data['sender_type'] ?? 'admin';   // 'admin' hoặc 'reader'
    $receiver_id = $data['receiver_id'] ?? ''; 
    if ($sender_id === false || !$chat_id || !$message_text) {
        $conn->send(json_encode([
            'type' => 'error',
            'message' => 'Missing sender/chat_id/text'
        ]));
        return;
    }

    try {
    $stmt = $this->pdo->prepare("
        INSERT INTO messages (chat_id, sender_type, sender_id, message_text)
        VALUES (:chat_id, :sender_type, :sender_id, :message_text)
        RETURNING message_id, sent_at
    ");

        $stmt->execute([
            ':chat_id'      => $chat_id,
            ':sender_type'  => $sender_type,
            ':sender_id'    => $sender_id,
            ':message_text' => $message_text
        ]);
        $savedMessage = $stmt->fetch(PDO::FETCH_ASSOC);
    } catch (\PDOException $e) {
        $conn->send(json_encode([
            'type'=>'error',
            'message'=>'DB error: '.$e->getMessage()
        ]));
        return;
    }

    $saved_at = $savedMessage['sent_at'] ?? date("H:i:s");
    // Gửi trực tiếp cho receiver nếu đang online
    if (isset($this->users[$receiver_id])) {
      $this->users[$receiver_id]->send(json_encode([
        'type'        => 'message',
        'chat_id'     => $chat_id,
        'sender_id'   => $sender_id,
        'sender_type' => $sender_type,
        'text'        => $message_text,
        'time'        => $saved_at
    ]));
  }

    // Gửi lại cho chính mình 
    $conn->send(json_encode([
        'type'        => 'message',
        'chat_id'     => $chat_id,
        'sender_id'   => $sender_id,
        'sender_type' => $sender_type,
        'text'        => $message_text,
        'time'        => $saved_at
    ]));
}
        
// 2. Dành cho admin khi chọn một cuộc chat
private function handleAdminGetMessages($conn, $data) {
    $admin_id = array_search($conn, $this->users);
    if ($admin_id === false) return;

    $chat_id = $data['chat_id'];

    try {
        $stmt = $this->pdo->prepare("
            SELECT sender_type, sender_id, message_text, sent_at
            FROM messages
            WHERE chat_id = :chat_id
            ORDER BY sent_at ASC
        ");
        $stmt->execute([':chat_id' => $chat_id]);
        $savedMessages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $conn->send(json_encode([
            'type' => 'get_message_when_changing_conversation',
            'messages' => $savedMessages
        ]));

    } catch (\PDOException $e) {
        $conn->send(json_encode([
            'type'=>'error',
            'message'=>'DB error: '.$e->getMessage()
        ]));
    }
}


    // 3. Hàm reader gửi tin nhắn 
    private function handleReaderSendMessages($conn, $data) {
    $sender_id = array_search($conn, $this->users);
    if ($sender_id === false) return;

    $message_text  = $data['text'] ?? null;
    $chat_id = $data['chat_id'] ?? null;
    $time = $data['time'] ?? null;
    $receiver_id = $data['receiver_id'] ?? null;
    $sender_type = $data['sender_type'];
    $full_name = $data['full_name'];
    
    try {
        $stmt = $this->pdo->prepare("
        INSERT INTO messages (chat_id, sender_type, sender_id, message_text)
        VALUES (:chat_id, :sender_type, :sender_id, :message_text)
        RETURNING message_id, sent_at
        ");

        $stmt->execute([
                        ':chat_id'      => $chat_id,
                        ':sender_type'  => $sender_type,
                        ':sender_id'    => $sender_id,
                        ':message_text' => $message_text                        
            ]);
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Gửi tin nhắn cho admin
        if (isset($this->users[$receiver_id])) {
      $this->users[$receiver_id]->send(json_encode([
        'type'        => 'message',
        'chat_id'     => $chat_id,
        'sender_id'   => $sender_id,
        'sender_type' => $sender_type,
        'text'        => $message_text,
        'time'        => $time,
        'full_name'   => $full_name
    ]));
  }
        // Gửi tin nhắn về cho bản thân 
        $conn->send(json_encode([
            'type' => 'message',
            'chat_id' => $chat_id,
            'text' => $message_text,
            'time' => $time,
            'sender_type' => $sender_type,
            'sender_id' => $sender_id,
            'full_name' => $full_name
        ]));

    } catch (\PDOException $e) {
        $conn->send(json_encode([
            'type'=>'error',
            'message'=>'DB error: '.$e->getMessage()
        ]));
    }
   }
 }

    // ===================== Run server =====================
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

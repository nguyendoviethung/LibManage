import { useState, useEffect } from "react";
import "./Chat.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { getChatList } from "../../api/ChatAPI";
import { jwtDecode } from "jwt-decode";

const token = localStorage.getItem("token");

export default function QAChat() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [chatListInfo, setChatListInfo] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [myUserId, setMyUserId] = useState("");
  const [socket, setSocket] = useState(null);
  
  // 
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setMyUserId(decoded.data.id);
    }
  }, [token]);

  // Hàm gửi tin nhắn khi nhập từ bàn phím
  const sendMessage = (msg) => {
    if (socket && socket.readyState === WebSocket.OPEN && msg.trim() !== "") {
      const currentChat = chatListInfo.find((u) => u.student_id === selectedUser);
      if (!currentChat) return;
      const data = {
          type: "admin_send_message",
          text: msg,
          chat_id: currentChat.chat_id,
          time: new Date().toISOString(),
          receiver_id: selectedUser,
          sender_type: "admin",
        }
      socket.send(
        JSON.stringify({
          type: "admin_send_message",
          text: msg,
          chat_id: currentChat.chat_id,
          time: new Date().toISOString(),
          receiver_id: selectedUser,
          sender_type: "admin",
        })
      );
      setMessage("");
      console.log("admin gửi ",data)
       console.log(myUserId)
    }
  };

  // Hàm lấy tin nhắn của user đang chọn
  const getMessages = () => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      const currentChat = chatListInfo.find((u) => u.student_id === selectedUser);
      if (!currentChat) return;
      socket.send(
        JSON.stringify({
          type: "get_message_when_changing_conversation",
          chat_id: currentChat.chat_id,
          time: new Date().toISOString(),
          mySelfID: myUserId,
          enemyID: selectedUser,
        })
      );
    }
  };

  //  Mount lần đầu
  useEffect(() => {
      const fetchMessages = async () => {
    try {
     const result = await getChatList(token);
      if (result.success) {    
        setChatListInfo(result.chats);   
        console.log("chats",result.chats)
      if (result.chats.length > 0) {
         setSelectedUser(result.chats[0].student_id);  // chọn user đầu tiên
         setChatMessages(result.lastChatMessages || []); // load luôn tin nhắn gần nhất
        }} else {
           setChatListInfo([]);
          setChatMessages([]);
    }} catch (error) {
        console.error("Lỗi khi lấy danh sách chat:", error);
      }
    };

    fetchMessages();

    // Kết nối WebSocket
    const s = new WebSocket(`ws://localhost:9000?token=${token}`);
    s.onopen = () => {
      console.log("Kết nối WebSocket thành công (đã kèm JWT)");
    };

    s.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "auth_success") return;
console.log("nhận lại ",msg)
      // Nhận tin nhắn mới
 if (msg.type === "message") {
    // 1. Thêm tin nhắn mới vào danh sách hội thoại hiện tại
    setChatMessages((prev) => [...prev, msg]);

    // 2. Cập nhật danh sách "chatListInfo"
if (msg.sender_type === "reader") {
  setChatListInfo((prev) => {
    const index = prev.findIndex((u) => u.chat_id === msg.chat_id);

    if (index !== -1) {
      // Đã có → cập nhật
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        text: msg.text,
        time: msg.time,
        is_read: msg.is_read ?? false,
        sender_id: msg.sender_id, 
      };
      return updated;
    } else {
      // Chưa có → thêm mới
      return [
        ...prev,
        {
          chat_id: msg.chat_id,
          reader_name: msg.full_name ?? "Người dùng",
          full_name: msg.full_name ?? "Người dùng",
          student_id: msg.sender_id,   // ⚡ lưu đúng field để đồng bộ
          text: msg.text,
          time: msg.time,
          sender_id: msg.sender_id, 
          is_read: msg.is_read ?? false,
        },
      ];
    }
  });
}
 else {
  setChatListInfo((prev) => {
    const index = prev.findIndex((u) => u.chat_id === msg.chat_id);
    if (index !== -1) {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        full_name: "Librarian",
        text: msg.text,
        time: msg.time,
        is_read: msg.is_read ?? false,
      };
      return updated;
    }
    return prev; // nếu không tìm thấy thì giữ nguyên
  });
  console.log("chatlistinfo",chatListInfo)
}


    // 3. Nếu là admin → không đụng chatListInfo, chỉ để hiển thị "Bạn: text"
  }
      // Nhận toàn bộ tin nhắn khi đổi user
      if (msg.type === "get_messages") {
        setChatMessages(msg.messages || []);
      }
    };

    s.onclose = () => {
      console.log("Mất kết nối WebSocket");
    };

    setSocket(s);
    return () => s.close();
  }, [token]);

  //  Khi đổi user → load lại tin nhắn từ server
  useEffect(() => {
    if (selectedUser) {
      getMessages(); // chỉ gọi WS, KHÔNG clear chatMessages
    }
  }, [selectedUser]);

  return (
    <>
    <div >
      <Navbar />
      <div className="qa-chat">
        {/* Left: User List */}
        <div className="chat-list">
          <div className="chat-list-back">
            <div className="back" onClick={handleBack}>
              <FontAwesomeIcon icon={faArrowLeft} />
            </div>
            <div className="chat-list-header">Chat list</div>
          </div>

          <div className="chat-users">
            {chatListInfo.map((u) => (
              <div
                key={`${u.chat_id}-${u.student_id}`}
                className={`chat-user ${u.sender_id === selectedUser ? "active" : ""}`}
                onClick={() => setSelectedUser(u.student_id)}
              >
                <div className="avatar">{u.reader_name.split(" ")[0]}</div>
                <div className="info">
                  <div className="name">{u.reader_name}</div>
                <div className="last-msg">
                  {u.sender_id === myUserId
  ? `Bạn: ${u.text.length > 15 ? u.text.slice(0, 15) + "..." : u.text}`
  : `${(u.reader_name ?? u.full_name ?? "Người dùng").split(" ")[0]}: ${u.text.length > 15 ? u.text.slice(0, 15) + "..." : u.text}`}

                </div>
                     <div className="time">
                       {new Date(u.time).toLocaleTimeString("vi-VN", {
                         hour: "2-digit",
                         minute: "2-digit"
                       })}{" "}
                       -{" "}
                       {new Date(u.time).toLocaleDateString("vi-VN", {
                         day: "2-digit",
                         month: "2-digit",
                         year: "numeric"
                       })}
                     </div>
                  {!u.is_read && <span className="unread-dot"></span>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle: Chat Window */}
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              {selectedUser
                ? chatListInfo.find((u) => u.student_id === selectedUser)?.full_name
                : "Chưa có cuộc trò chuyện"}
            </div>
          </div>

          <div className="chat-messages">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`chat-message ${
                  msg.sender_type === "admin" ? "self" : "other"
                }`}
              >
                  {msg.text || msg.message_text}
              </div>
            ))}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter message..."
            />
            <button onClick={() => sendMessage(message)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage(message);
                             }}}
                       >Send  
            </button>
          </div>
        </div>

        {/* Right: Options */}
        <div className="chat-options">
          <div className="options-header">Options</div>
          <div className="options-section">
            <h4>Link sent</h4>
            <ul>
              <li>
                <a href="#">http://example.com</a>
              </li>
            </ul>
          </div>
          <div className="options-section">
            <h4>Photos sent</h4>
            <div className="image-grid">
              <img src="https://via.placeholder.com/100" alt="img" />
              <img src="https://via.placeholder.com/100" alt="img" />
            </div>
          </div>
        </div>
      </div>
      </div>
    </>

  );
}

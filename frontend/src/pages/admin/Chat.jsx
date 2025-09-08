import { useState, useEffect } from "react";
import "./Chat.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/navbar/Navbar.jsx";
import { useNavigate } from "react-router-dom";
import { getChatList } from "../../api/ChatAPI";
import { jwtDecode } from "jwt-decode";

export default function QAChat() {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  const [selectedUser, setSelectedUser] = useState(null);
  const [chatListInfo, setChatListInfo] = useState([]);
  const [chatMessages, setChatMessages] = useState([]); // Tin nhắn của user đang chọn
  const [message, setMessage] = useState("");
  const [myUserId, setMyUserId] = useState("");
  const [socket, setSocket] = useState(null);
  const [token, setToken] = useState(null);
  
 // Khởi tạo token khi gắn kết
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

// Cập nhật myUserId khi mã thông báo thay đổi
  useEffect(() => {
    if (token) {
      const decoded = jwtDecode(token);
      setMyUserId(decoded.data.id);
    } else {
      setMyUserId("");
    }
  }, [token]);

  // Hàm gửi tin nhắn khi nhập từ bàn phím
  const sendMessage = (msg) => {
    if (socket && socket.readyState === WebSocket.OPEN && msg.trim() !== "") {
      const currentChat = chatListInfo.find((u) => u.student_id === selectedUser);
      if (!currentChat) return;
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

  useEffect(() => {
    if (!token) return;
    
    setChatMessages([]);
    setChatListInfo([]);
    setSelectedUser(null);

    const fetchMessages = async () => {
      try {
        const result = await getChatList(token);
        console.log("result", result);
        if (result.success) {
          setChatListInfo(result.chats);
          if (result.chats.length > 0) {
            setSelectedUser(result.chats[0].student_id);
            setChatMessages(result.lastChatMessages || []);
          }
        } else {
          setChatListInfo([]);
          setChatMessages([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chat:", error);
      }
    };

    fetchMessages();

    // Kết nối WebSocket với token hiện hành
    const s = new WebSocket(`ws://localhost:9000?token=${token}`);
    s.onopen = () => {
      console.log("Kết nối WebSocket thành công (đã kèm JWT)");
    };

    s.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "auth_success") return;
      // Nhận tin nhắn mới
if (msg.type === "message") {
  // 1. Thêm tin nhắn mới vào danh sách hội thoại hiện tại
   
    setChatMessages((prev) => 
    {
      if (msg.chat_id === chatListInfo.find((u) => u.student_id === selectedUser)?.chat_id) {
        return [...prev, msg.text];
      }
      return prev;
    });

  // 2. Cập nhật + sắp xếp danh sách chatListInfo
  setChatListInfo((prev) => {
    const index = prev.findIndex((u) => u.chat_id === msg.chat_id);
    let updated;

    if (index !== -1) {
      // Đã có → cập nhật
      updated = [...prev];
      updated[index] = {
        ...updated[index],
        text: msg.text,
        time: msg.time,
        is_read: msg.is_read ?? false,
        sender_id: msg.sender_id,
        full_name: msg.sender_type === "reader" 
          ? msg.full_name ?? "Người dùng" 
          : "Librarian",
      };
    } else {
      // Chưa có → thêm mới
      updated = [
        ...prev,
        {
          chat_id: msg.chat_id,
          reader_name: msg.full_name ?? "Người dùng",
          full_name: msg.sender_type === "reader" 
            ? msg.full_name ?? "Người dùng" 
            : "Librarian",
          student_id: msg.sender_id,
          text: msg.text,
          time: msg.time,
          sender_id: msg.sender_id,
          is_read: msg.is_read ?? false,
        },
      ];
    }

    // Sort theo thời gian giảm dần (tin nhắn mới nhất lên đầu)
    return updated.sort((a, b) => new Date(b.time) - new Date(a.time));
  });
}

      // Nhận toàn bộ tin nhắn khi đổi user
      if (msg.type === "get_message_when_changing_conversation") {
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
                className={`chat-user ${u.student_id === selectedUser ? "active" : ""}`}
                onClick={() => setSelectedUser(u.student_id)}
              >
                <div className="avatar">{u.reader_name.split(" ").pop().charAt(0)}</div>
                <div className="info">
                  <div className="name">{u.reader_name}</div>
                <div className="last-msg">
                  {u.sender_id === myUserId
                  ? `My message: ${u.text.length > 15 ? u.text.slice(0, 15) + "..." : u.text}`
                  : `${(u.reader_name ??  "Reader").split(" ").pop()}: ${u.text.length > 15 ? u.text.slice(0, 15) + "..." : u.text}`}
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
                  {/* {!u.is_read && <span className="unread-dot"></span>} */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cửa sổ chat */}
        <div className="chat-window">
          <div className="chat-header">
            <div className="chat-title">
              {selectedUser
                ? chatListInfo.find((u) => u.student_id === selectedUser)?.reader_name
                : "There are no conversations"}
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                   sendMessage(message);
                             }}}
            />
            <button onClick={() => sendMessage(message)}
                       >Send  
            </button>
          </div>
        </div>

        {/* Tùy chọn */}
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

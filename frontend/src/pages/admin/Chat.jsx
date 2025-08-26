import { useState, useEffect } from "react";
import "./Chat.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from '../../components/navbar/Navbar.jsx'
import { useNavigate } from 'react-router-dom';
import { apiChat , getChatList} from '../../api/ChatAPI';

export default function QAChat() {

  const token = localStorage.getItem("token"); 

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1); 
  };

  const [selectedUser, setSelectedUser] = useState(1);
  // mỗi ob gồm readerID, họ tên người chat và tin nhắn chat gần nhất của từng người đã chat 
  const [chatListInfo, setChatListInfo] = useState([
    
  ]); 
  // Tin nhắn của người chat gần nhất 
  const [latestChat, setLastestChat] = useState([]);
  const [messages, setMessages] = useState([]); 
  const [myUserId, setMyUserId] = useState(null);
  const [ws, setWs] = useState(null);

  useEffect(() => {

    // 1️. Danh sách người đã chat ( hiện tin nhắn vẫn còn) và tin nhắn của người chat gần nhất 
    const fetchMessages = async () => {
      try {
        const result = await getChatList(token);
        console.log("result",result)
        if (result.success) {
         setChatListInfo(result.chats)
         console.log("chat",chatListInfo)
         setLastestChat(result.lastChatMessages)
         console.log("last",latestChat)
        } else {
          console.error("API không trả về mảng:", result);
          setChatListInfo([]);
          setLastestChat()
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách người nhắn và tin nhắn gần nhất:", error);
      }
    };

    fetchMessages();

    // 2. Kết nối WebSocket
    const socket = new WebSocket("ws://localhost:9000");

    socket.onopen = () => {
      console.log("Kết nối WebSocket thành công");
      socket.send(JSON.stringify({ type: "auth", token }));
    };

    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === "auth_success") {
        setMyUserId(msg.user_id);
        return;
      }
      if (msg.type === "message") {
        const normalized = { sender_id: msg.user, content: msg.text, sent_at: msg.time };
        setMessages((prev) => Array.isArray(prev) ? [...prev, normalized] : [normalized]);
      }
    };

    socket.onclose = () => {
      console.log("Mất kết nối WebSocket");
    };

    setWs(socket);

    return () => {
      socket.close();
    };
  }, [token]);

  return (
    <>
    <Navbar />
    <div className="qa-chat">
      {/* Left: User List */}
      <div className="chat-list">
        <div className = "chat-list-back">
         <div className = "back" onClick={handleBack}>
        <FontAwesomeIcon icon = {faArrowLeft} />
        </div>
        <div className="chat-list-header">Chat list</div>
         </div>
      <div className="chat-users">
  {chatListInfo.map((u) => (
    <div
      key={u.id}
      className={`chat-user ${u.id === selectedUser ? "active" : ""}`}
      onClick={() => setSelectedUser(u.id)}
    >
      <div className="avatar">{u.full_name.charAt(0)}</div>
      <div className="info">
        <div className="name">{u.full_name}</div>
        <div className="last-msg">{u.message}</div>
        <div className="time">{new Date(u.time_sent).toLocaleTimeString()}</div>
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
            {chatListInfo.length > 0 ? chatListInfo[0].full_name : "Chưa có cuộc trò chuyện"}
        </div>

        </div>
<div className="chat-messages">
  {latestChat.map((msg) => (
    <div
      key={msg.message_id}
      className={`chat-message ${msg.sender_type === "admin" ? "user" : "user"}`}
    >
      {msg.message_text}
    </div>
  ))}
</div>

        <div className="chat-input">
          <input type="text" placeholder="Nhập tin nhắn..." />
          <button>Gửi</button>
        </div>
      </div>

      {/* Right: Options */}
      <div className="chat-options">
        <div className="options-header">Tùy chọn</div>
        <div className="options-section">
          <h4>Link đã gửi</h4>
          <ul>
            <li><a href="#">http://example.com</a></li>
          </ul>
        </div>
        <div className="options-section">
          <h4>Ảnh đã gửi</h4>
          <div className="image-grid">
            <img src="https://via.placeholder.com/100" alt="img" />
            <img src="https://via.placeholder.com/100" alt="img" />
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

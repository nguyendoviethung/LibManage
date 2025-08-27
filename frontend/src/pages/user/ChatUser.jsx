    import Navbar from "../../components/navbar/Navbar";
    import "../admin/Chat.scss";
    import { jwtDecode } from "jwt-decode";
    import { useState, useEffect } from "react";
    import axios from "axios";

    const token = localStorage.getItem("token");

    export default function Chat() {
    const [listMessages, setListMessages] = useState([]); // Đoạn tin nhắn từ trước đến giờ 
    const [message,setMessage] = useState("");
    const [socket, setSocket] = useState(null);
    const [receicer_id,setReceiver_id] = useState();
    const [myUserId, setMyUserId] = useState("");
    const [chat_id , setChat_id] = useState();
    
    const sendMessage = (msg) => {
        if (socket && socket.readyState === WebSocket.OPEN && msg.trim() !== "") {
      
      socket.send(
        JSON.stringify({
          type: "message",
          text: msg,
          chat_id: chat_id,
          time: new Date().toISOString(),
          sender_id: myUserId,
          receiver_id: receicer_id ,
          sender_type: "admin",
        })
      );
      setMessage("");
    }
    }
    useEffect(() => {
        if (token) {
        const decoded = jwtDecode(token);
        setMyUserId(decoded.data.id); // lấy user_id từ token
        }
    }, []);

    useEffect(() => {
        const fetchMessages = async () => {
        try {
            // 🔹 Gọi API lấy tin nhắn trước đó với thủ thư
            const result = await axios.get(
            "http://localhost/LibManage/backend/api/user-chat/get-messages.php",
            {
                headers: { Authorization: `Bearer ${token}` },
            }
            );
            console.log(result.data)
            if (result.data.success) {
            setListMessages(result.data.chats || []);
            setReceiver_id(result.data.admin_id);
            setChat_id(result.data.chat_id);
            } else {
            setListMessages([]);
            }
        } catch (error) {
            console.error("Lỗi khi lấy danh sách chat:", error);
        }
        };

        fetchMessages();

        // 🔹 Kết nối WebSocket
        const s = new WebSocket(`ws://localhost:9000?token=${token}`);
        s.onopen = () => {
        console.log("Kết nối WebSocket thành công (đã kèm JWT)");
        };

        s.onmessage = (event) => {
        const msg = JSON.parse(event.data);

        if (msg.type === "auth_success") return;

        // Nhận tin nhắn mới
        if (msg.type === "message") {
            const normalized = {
            sender_id: msg.sender_id,
            content: msg.text,
            sent_at: msg.time,
            };
            setListMessages((prev) => [...prev, normalized]);
        }
        };

        s.onclose = () => {
        console.log("Mất kết nối WebSocket");
        };

        setSocket(s);
        return () => s.close();
    }, [token]);

    return (
        <>
        <div className="qa-chat">
            <div className="chat-window">
            <div className="chat-header">
                <div className="chat-title">Thư viện</div>
            </div>

            <div className="chat-messages">
                {listMessages.map((msg, idx) => (
                <div
                    key={idx}
                    className={`chat-message ${
                    msg.sender_id === myUserId ? "admin" : "user"
                    }`}
                >
                    {msg.message_text}
                </div>
                ))}
            </div>

            <div className="chat-input">
                <input placeholder="Nhập tin nhắn..." value = {message} onChange={e => setMessage(e.target.value)
                } />
                <button onClick = {()=> sendMessage(message)}>Gửi</button>
            </div>
            </div>

            <div className="chat-options">
            <div className="options-header">Tùy chọn</div>
            <div className="options-section">
                <h4>Link đã gửi</h4>
                <ul>
                <li>
                    <a href="#">http://example.com</a>
                </li>
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

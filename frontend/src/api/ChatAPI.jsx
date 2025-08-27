import axios from "axios";

const BASE_URL = "http://localhost:8080/api/chat/chat.php";

  export const getChatList = (token) =>
    axios.get("http://localhost/LibManage/backend/api/chat/get-chat-list.php", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.data);
  
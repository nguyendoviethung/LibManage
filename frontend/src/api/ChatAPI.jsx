import axios from "axios";

  export const getChatList = (token) =>
    axios.get("http://localhost/LibManage/backend/api/chat/get-chat-list.php", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => res.data);
  
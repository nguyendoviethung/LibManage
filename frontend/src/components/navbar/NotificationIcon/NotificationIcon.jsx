import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './NotificationIcon.scss';
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import ReviewModal from "../../review_modal/ReviewModal.jsx";

function NotificationIcon() {
  const [readerID, setReaderID] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      setReaderID(decoded.data.id);
    } catch (err) {
      console.error("Token decode error:", err);
    }
  }, []);

  useEffect(() => {
    if (!readerID) return;

    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost/LibManage/backend/api/notifications/get-notifications.php",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          console.log("Fetched notifications:", res.data.data);
          setNotifications(res.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [readerID]);

  // Hàm đánh dấu đã đọc
  const markAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost/LibManage/backend/api/notifications/mark-notifications-read.php",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Cập nhật local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error("Error marking notifications as read:", err);
    }
  };

  // Handle click icon
  const handleIconClick = () => {
    if (!showDropdown) {
      // Nếu đang đóng → mở và đánh dấu đã đọc
      markAsRead();
    }
    setShowDropdown(!showDropdown);
  };

  // Đếm số thông báo CHƯA ĐỌC
  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="notification-icon">
      <div className="icon-wrapper" onClick={handleIconClick}>
        <FontAwesomeIcon icon={faBell} />
        {unreadCount > 0 && (
          <span className="badge">{unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="dropdown-header">
            Đánh giá sách
          </div>
          <div className="dropdown-content">
            {notifications.length === 0 ? (
              <div className="empty-message">
                Không có sách cần đánh giá
              </div>
            ) : (
              notifications.map(item => (
                <div key={item.notification_id} className="notification-item">
                  <span className="book-title">{item.payload.title}</span>
                  <button
                    className="review-btn"
                    onClick={() => setSelectedBook(item)}
                  >
                    Đánh giá
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {selectedBook && (
        <ReviewModal
          bookId={selectedBook.book_id}
          returnId={selectedBook.return_id}
          onClose={() => setSelectedBook(null)}
          onSuccess={() => {
            setSelectedBook(null);
            // Xóa notification đã đánh giá khỏi danh sách
            setNotifications(prev =>
              prev.filter(n => n.notification_id !== selectedBook.notification_id)
            );
          }}
        />
      )}
    </div>
  );
}

export default NotificationIcon;
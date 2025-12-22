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
          {
            headers: { Authorization: `Bearer ${token}` }
          }
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

  return (
    <div className="notification-wrapper">
      <div
        className="bell-icon"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FontAwesomeIcon icon={faBell} />
        {notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notification-dropdown">
          <h4> Đánh giá sách</h4>

          {notifications.length === 0 ? (
            <p>Không có sách cần đánh giá</p>
          ) : (
            notifications.map(item => (
              <div key={item.borrow_id} className="review-item">
                <span>{item.payload.title}</span>
                <button onClick={() => setSelectedBook(item)}>
                  Đánh giá
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {selectedBook && (
        <ReviewModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onSuccess={() => {
            setSelectedBook(null);
            // setNotifications(prev =>
            //   prev.filter(n => n.borrow_id !== selectedBook.borrow_id)
            // );
          }}
        />
      )}
    </div>
  );
}

export default NotificationIcon;

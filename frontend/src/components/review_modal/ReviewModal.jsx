import "./ReviewModal.scss";
import { useState } from "react";
import axios from "axios";

function ReviewModal({ book, onClose, onSuccess }) {
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost/LibManage/backend/api/notifications/submit-review.php",
        {
          return_id: book.return_id,
          reader_id : book.reader_id,
          book_id: book.book_id,
          comment : comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (res.data.success) {
        alert("Đánh giá thành công!");
        onSuccess();
      }
    } catch (err) {
      alert("Lỗi khi gửi đánh giá");
    }
  };

  return (
    <div className="review-overlay">
      <div className="review-modal">
        <h3>Đánh giá: {book.book_title}</h3>
        <textarea
          placeholder="Nhận xét của bạn..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <div className="actions">
          <button className="cancel" onClick={onClose}>Hủy</button>
          <button className="submit" onClick={handleSubmit}>Gửi</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewModal;

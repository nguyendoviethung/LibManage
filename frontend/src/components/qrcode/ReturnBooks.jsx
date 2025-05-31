import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScannerModal.scss';
import InputField from '../inputfield/InputField';
import Button from '../button/Button';
import AlertBox from '../alert-box/AlertBox';
import { getBooks } from '../../api/LendingService';

function ReturnBooks({ handleReturnBooks, onClose }) {
  const [formData, setFormData] = useState({
    studentId: '',
    books: [] // chứa mảng sách từ backend
  });
  const [notification, setNotification] = useState(null); // Thông báo ra màn hình 

  // Bỏ chọn những sách không muốn trả ngay bây giờ
  const removeBook = (index) => {
    setFormData((prev) => ({
      ...prev,
      books: prev.books.filter((_, i) => i !== index)
    }));
  };

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qrcode");
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 5, qrbox: 250 },
      async (decodedText) => {
        const code = decodedText.trim();
        const studentID = code.split(':')[1]?.trim();

        const res = await getBooks({studentID}); // Láy sách từ mã số sinh viên quét được

        if (res?.success) { // Nếu sinh viên có sách thì gán sách và mã số sinh viên vào trong formData
          setFormData({
            studentId: studentID,
            books: res.data
          });
          setNotification(null); 
        } else {
          console.log(formData)
          setNotification({
            message: res.message || "Không tìm thấy thông tin sách.",
            type: "error"
          });
        }
      },
      (errorMsg) => {
        console.log("QR scan error:", errorMsg);
      }
    );

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  // Xử lí khi submit
  const handleSubmit = (e) => {
    e.preventDefault();
    handleReturnBooks({
      studentID: formData.studentId,
      bookIDs: formData.books.map(book => book.book_id)
    });
    setFormData({ studentId: '', books: [] });
  };

  // Xử lí khi đóng camera
  const handleClose = () => {
    setFormData({ studentId: '', books: [] });
    onClose();
  };

  return (
    <>
    {/* Thông báo ra màn hình */}
      {notification && (
        <AlertBox
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
          {/* Phần hiện camera và hiển thị danh sách sách đã mượn để trả lại thư viện */}
      <div className="qr-modal">
        <div className="qr-header">
          <span>Quét mã QR</span>
          <button onClick={handleClose} className="close-btn">✕</button>
        </div>

        <div id="qrcode" style={{ width: '100%' }}></div>

        <form className="qr-form" onSubmit={handleSubmit}>
          {formData.studentId && (
            <div className="form-group">
              <label>Mã số sinh viên</label>
              <InputField type="text" value={formData.studentId} disabled={true} />
            </div>
          )}

          {formData.books.map((book, index) => (
            <div className="form-group" key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <InputField
                type="text"
                value={book.title}
                disabled={true}
              />
              <button type="button" onClick={() => removeBook(index)} className="cancel-btn">
                Hủy 
              </button>
            </div>
          ))}

          {formData.books.length > 0 && <Button text="Hoàn tất trả sách" />}
        </form>
      </div>
    </>
  );
}

export default ReturnBooks;

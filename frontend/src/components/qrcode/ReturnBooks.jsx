import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScannerModal.scss';
import InputField from '../inputfield/InputField';
import Button from '../button/Button';
import AlertBox from '../alert-box/AlertBox';
import { getBooks } from '../../api/LendingService';

function ReturnBooks({ onScanSuccess, onClose }) {
  const [formData, setFormData] = useState({
    studentId: '',
    books: [] // chứa mảng sách từ backend
  });
  const [notification, setNotification] = useState(null);

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

        const res = await getBooks(studentID);

        if (res?.success) {
          setFormData({
            studentId: studentID,
            books: res.data
          });
          setNotification(null);
        } else {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    onScanSuccess({
      studentId: formData.studentId,
      bookIDs: formData.books.map((book) => book.book_id)
    });
    setFormData({ studentId: '', books: [] });
  };

  const handleClose = () => {
    setFormData({ studentId: '', books: [] });
    onClose();
  };

  return (
    <>
      {notification && (
        <AlertBox
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

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

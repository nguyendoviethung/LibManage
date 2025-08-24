import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScannerModal.scss';
import InputField from '../inputfield/InputField';
import Button from '../button/Button';
import AlertBox from '../alert-box/AlertBox';
import { getBorrowedBooks } from '../../api/LendingService';

function ReturnBooks({ handleReturnBooks, onClose , token}) {
  const [formData, setFormData] = useState({
    studentId: '',
    books: [] ,
    reader_id :''
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
    const html5QrCode = new Html5Qrcode("qrcode_return");
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 3, qrbox: 270 },
      async (decodedText) => {
        const code = decodedText.trim();
        const studentID = code.split(':')[1]?.trim();
        const res = await getBorrowedBooks(studentID,{studentID: studentID},token); 
        console.log(res)
        if (res?.success) { 
          setFormData({
            studentId: studentID,
            books: res.data,
            reader_id: res.data.reader_id
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
      readerID: formData.books[0]?.reader_id || '',
      bookIDs: formData.books.map(book => book.book_id)
    });
    setFormData({ studentId: '', books: [], reader_id : ''});
  };

  // Xử lí khi đóng camera
  const handleClose = () => {
    setFormData({ studentId: '', books: [] , reader_id : ''});
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
          <span>Scan QR code to return book</span>
          <button onClick={handleClose} className="close-btn">✕</button>
        </div>

        <div id="qrcode_return" style={{ width: '100%' }}></div>

        <form className="qr-form" onSubmit={handleSubmit}>
          {formData.studentId && (
            <div className="form-group">
            <label>Student ID</label>
              <InputField type="text" value={formData.studentId} disabled={true} />
            </div>
          )}

          {formData.books.map((book, index) => (
            <div className="form-group" key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <button type="button" onClick={() => removeBook(index)} className="cancel-btn">
                Erase 
              </button>
              <InputField
                type="text"
                value={book.title}
                disabled={true}
              />
           
            </div>
          ))}

          {formData.books.length > 0 && <Button text="Return book" />}
        </form>
      </div>
    </>
  );
}

export default ReturnBooks;

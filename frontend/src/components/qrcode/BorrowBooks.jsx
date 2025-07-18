import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScannerModal.scss';
import InputField from '../inputfield/InputField.jsx';
import Button from '../button/Button.jsx';
import { checkStudentId } from '../../api/LendingService';
import AlertBox from '../alert-box/AlertBox';

function BorrowBooks({ handleBorrowBooks, onClose }) {
  const [formData, setFormData] = useState({
    studentId: '',
    bookIDs: []
  });

  const scannedBookIDsRef = useRef(new Set()); // Để lưu trữ mã sách đã quét
  const [notification,setNotification] = useState(null); // State thông báo

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qrcode"); // Tạo một instance(đối tượng cụ thể) của Html5Qrcode
    //Bắt đầu quét mã QR
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 5, qrbox: 250 }, // fps: 10 khung hình/giây, qrbox: kích thước vùng quét
      async (decodedText) => {
        //Data khi quét được mã QR
        console.log("QR code scanned:", decodedText);
        const code = decodedText.trim();
        const Id = code.split(':')[1].trim(); // Lấy mã sinh viên hoặc mã sách từ mã QR
        const format = code.split(':')[0].trim(); // Lấy định dạng mã QR (studentId hoặc bookIDs)
        // Nếu format là mã sinh viên → kiểm tra tính hợp lệ của sinh viên
        if (format === 'studentId') {
          const result = await checkStudentId({ studentId: Id });
          if (result.success) { // Nếu sinh viên hợp lệ thì gán studentId vào formData
            setFormData((prev) => ({
              ...prev,
              studentId: Id
            }));
            setNotification({message : result.message, type : "success"}) // Thông báo sinh viên hợp lệ ra màn hình
          } else {
            setNotification({message : result.message, type : "error"})  // Thông báo sinh viên không hợp lệ ra màn hình
            setFormData((prev) => ({ // Reset lại formData
              ...prev,
              studentId: ''
            }));
            return;
          }
        }
        // Nếu là mã sách mới → thêm vào bookIDs
        else if (
          format === 'bookID' &&
          !scannedBookIDsRef.current.has(Id) &&
          Id !== formData.studentId
        ) {
          scannedBookIDsRef.current.add(Id);
          setFormData((prev) => ({
            ...prev,
            bookIDs: [...prev.bookIDs, Id]
          }));
        }
      },
      (errorMsg) => {
        console.log("QR code scan error:", errorMsg);
      }
    );

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Gửi dữ liệu:", formData);

    // Gửi dữ liệu mượn sách (dạng object JSON) về component cha để xử lý
    handleBorrowBooks({
      studentId: formData.studentId,
      bookIDs: formData.bookIDs
    });

    // Reset form
    setFormData({
      studentId: '',
      bookIDs: []
    });
    // setLastScannedCode(''); // Reset mã sách đã quét
    scannedBookIDsRef.current.clear(); // Reset mã sách đã quét
  };

  // Khi nhấn nút đóng modal thì reset lại formData
  const handleClose = () => {
    setFormData({
      studentId: '',
      bookIDs: []
    });
    // setLastScannedCode(''); // Reset mã sách đã quét
    scannedBookIDsRef.current.clear(); // Reset mã sách đã quét
    onClose(); // đóng modal
  };

  return (
    <>
      {/* Thông báo xem sinh viên có hợp lệ hay không */}
      {notification !== null && (
        <AlertBox //
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
          {/*Quét được student ID thì hiện */}
          {formData.studentId && (
            <div className="form-group">
              <label>Mã số sinh viên</label>
              <InputField
                type="text"
                value={formData.studentId}
                disabled={true}
              />
            </div>
          )}

          {/* Quét được sách thì lặp qua mảng rồi hiện */}
          {formData.bookIDs.map((code, index) => (
            <div className="form-group" key={index}>
              <label>Mã sách của cuốn thứ {index + 1}</label>
              <InputField
                type="text"
                value={code}
                disabled={true}
              />
            </div>
          ))}

          {/* Nếu có mã sách thì hiện nút gửi */}
          {formData.bookIDs.length > 0 && <Button text="Gửi" />}
        </form>
      </div>
    </>
  );
}

export default BorrowBooks;

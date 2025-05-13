import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScannerModal.scss';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import {checkStudentId } from '../../api/LendingService';
import AlertBox from '../alert-box/AlertBox';
function QRScannerModal({ onScanSuccess, onClose, NotificationBookCode, setNotificationBookCode }) {
  const [formData, setFormData] = useState({
    studentId: '',
    bookIDs: []
  });

  const [lastScannedCode, setLastScannedCode] = useState(''); // Lưu mã đã quét gần nhất
  const [NotificationStudentID, setNotificationStudentID] = useState(null); // Thông báo khi quét mã Q của sinh viên và sách

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qrcode"); // Tạo một instance(đối tượng cụ thể) của Html5Qrcode

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
           const result = await checkStudentId({studentId:Id});
           if(result.success){ // Nếu sinh viên hợp lệ thì gán studentId vào formData
            setFormData((prev) => ({
              ...prev,
              studentId: Id
            }));
            setNotificationStudentID(true); // Thông báo sinh viên hợp lệ ra màn hình
           }else{
            setNotificationStudentID(false); // Thông báo sinh viên không hợp lệ ra màn hình
            setFormData((prev) => ({ // Reset lại formData
              ...prev,
              studentId: ''
            }));
            return;
           }
        }
        // Nếu là mã sách mới → thêm vào bookIDs
        else if (
          format !==  'studentId' && // định dạng mã QR là mã sách
          Id !== lastScannedCode && // khác code đã quét trước đó
          !formData.bookIDs.includes(Id) && // chưa có trong danh sách
          Id !== formData.studentId // tránh trùng với mã sinh viên
        ) {
          setFormData((prev) => ({
            ...prev,
            bookIDs: [...prev.bookIDs, Id]
          }));
          setLastScannedCode(Id);
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

    // Gửi dữ liệu về cha để xử lý
    onScanSuccess(formData); 
    
    // Reset form
    setFormData({
      studentId: '',
      bookIDs: []
    });
    setLastScannedCode('');
  };

  return (
  <>
  {/* Thông báo xem sinh viên có hợp lệ hay không */}
    {NotificationStudentID !== null && (
    <AlertBox
    message={NotificationStudentID ? 'Sinh viên được phép mượn sách!' : 'Sinh viên không được phép mượn sách!'}
    type={NotificationStudentID ? 'success' : 'error'}
    onClose={() => setNotificationStudentID(null)}
    />
  )}

  {/* Thông báo xem có mượn sách thành công hay không */}
    { NotificationBookCode !== null && (
    <AlertBox
    message={NotificationBookCode ? 'Mượn sách thành công!' : 'Mượn sách không thành công!'}
    type={NotificationBookCode ? 'success' : 'error'}
    onClose={() => setNotificationBookCode(null)}
    />
    )}

    <div className="qr-modal">
      <div className="qr-header">
        <span>Quét mã QR</span>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      <div id="qrcode" style={{ width: '100%' }}></div>
      <form className="qr-form" onSubmit={handleSubmit}>
           {/*Quét được student ID thì hiện  */}
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

    {/* Quét được sách thì lặp qua mảng rồi hiện  */}
        {formData.bookIDs.map((code, index) => (
          <div className="form-group" key={index}>
            <label>Mã sách #{index + 1}</label>
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

export default QRScannerModal;

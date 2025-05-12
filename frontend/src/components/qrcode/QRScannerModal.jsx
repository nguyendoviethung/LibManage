import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScannerModal.scss';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';

function QRScannerModal({ onScanSuccess, onClose }) {
  const [formData, setFormData] = useState({
    studentId: '',
    bookCodes: []
  });

  const [lastScannedCode, setLastScannedCode] = useState('');

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qrcode"); // Tạo một instance(đối tượng cụ thể) của Html5Qrcode

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 320 }, // fps: 10 khung hình/giây, qrbox: kích thước vùng quét
      (decodedText) => {
        const code = decodedText.trim();

        // Nếu là lần quét đầu tiên → gán mã sinh viên
        if (!formData.studentId) {
          // KIỂM TRA XEM SINH VIÊN MƯỢN SÁCH CÓ HỢP LỆ KHÔNG
          setFormData((prev) => ({
            ...prev,
            studentId: code
          }));
          setLastScannedCode(code);
        }
        // Nếu là mã sách mới → thêm vào bookCodes
        else if (
          code !== lastScannedCode && // khác code đã quét trước đó
          !formData.bookCodes.includes(code) && // chưa có trong danh sách
          code !== formData.studentId // tránh trùng với mã sinh viên
        ) {
          setFormData((prev) => ({
            ...prev,
            bookCodes: [...prev.bookCodes, code]
          }));
          setLastScannedCode(code);
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

    // Gửi dữ liệu về cha
    onScanSuccess(formData);

    // Reset form
    setFormData({
      studentId: '',
      bookCodes: []
    });
    setLastScannedCode('');
  };

  return (
    <div className="qr-modal">
      <div className="qr-header">
        <span>Quét mã QR</span>
        <button onClick={onClose} className="close-btn">✕</button>
      </div>
      <div id="qrcode" style={{ width: '100%' }}></div>
             {/*Quét được student ID thì hiện  */}
      <form className="qr-form" onSubmit={handleSubmit}>
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
        {formData.bookCodes.map((code, index) => (
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
      {formData.bookCodes.length > 0 && <Button text="Gửi" />}

      </form>
    </div>
  );
}

export default QRScannerModal;

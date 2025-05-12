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
    const html5QrCode = new Html5Qrcode("qrcode");

    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 10, qrbox: 320 },
      (decodedText) => {
        const code = decodedText.trim();

        // Nếu là lần quét đầu tiên → gán mã sinh viên
        if (!formData.studentId) {
          setFormData((prev) => ({
            ...prev,
            studentId: code
          }));
          setLastScannedCode(code);
        }
        // Nếu là mã sách mới → thêm vào bookCodes
        else if (
          code !== lastScannedCode &&
          !formData.bookCodes.includes(code) &&
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
  }, [formData.studentId, formData.bookCodes, lastScannedCode]);

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

      <form className="qr-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mã số sinh viên</label>
          <InputField
            type="text"
            value={formData.studentId}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, studentId: e.target.value }))
            }
          />
        </div>

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

        <Button text="Gửi" />
      </form>
    </div>
  );
}

export default QRScannerModal;

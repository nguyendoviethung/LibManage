import { useEffect, useState, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import './QRScannerModal.scss';
import InputField from '../inputfield/InputField.jsx';
import Button from '../button/Button.jsx';
import { checkStudent } from '../../api/LendingService';
import AlertBox from '../alert-box/AlertBox';

function BorrowBooks({ handleBorrowBooks, onClose , token}) {
  const [formData, setFormData] = useState({
    studentId: '',
    reader_id :'',
    bookIDs: []
  });

  const scannedBookIDsRef = useRef(new Set()); 
  const [notification,setNotification] = useState(null); 

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("qrcode"); 
    html5QrCode.start(
      { facingMode: "environment" },
      { fps: 3, qrbox: 300 }, 
      async (decodedText) => {
        console.log("QR code scanned:", decodedText);
        const code = decodedText.trim();
        const Id = code.split(':')[1].trim(); 
        const format = code.split(':')[0].trim(); 
        if (format === 'studentId') {
          const result = await checkStudent( {studentId : Id}, {studentId : Id} , token);
          if (result.success) { 
            setFormData((prev) => ({
              ...prev,
              studentId: Id,
              reader_id : result.reader_id
            }));
            setNotification({message : result.message, type : "success"}) 
          } else {
            setNotification({message : result.message, type : "error"})  
            setFormData((prev) => ({ 
               studentId: '',
               bookIDs: prev.bookIDs
            }));
            return;
          }
        }
       
        else if (
          format === 'bookID' &&
          !scannedBookIDsRef.current.has(Id) 
          // &&
          // Id !== formData.studentId
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
      html5QrCode.stop()
        .then(() => html5QrCode.clear())
        .catch((err) => console.error("Lỗi dừng scanner:", err));
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Gửi dữ liệu:", formData);

    handleBorrowBooks({
      studentId: formData.studentId,
      bookIDs: formData.bookIDs,
      reader_id : formData.reader_id
    });

    setFormData({
      studentId: '',
      reader_id : '',
      bookIDs: []
    });
   
    scannedBookIDsRef.current.clear(); 
  };

  const handleClose = () => {
    setFormData({
      studentId: '',
       reader_id : '',
      bookIDs: []
    });
    scannedBookIDsRef.current.clear(); 
    onClose(); 
  };

  return (
    <>
     
      {notification !== null && (
        <AlertBox 
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="qr-modal">
        <div className="qr-header">
          <span>Scan QR code to borrow books</span>
          <button onClick={handleClose} className="close-btn">✕</button>
        </div>
        <div id="qrcode" style={{ width: '100%' }}></div>
        <form className="qr-form" onSubmit={handleSubmit}>
       
          {formData.studentId && (
            <div className="form-group">
              <label style = {{marginRight : "10px"}}>Student ID</label>
              <InputField
                type="text"
                value={formData.studentId}
                disabled={true}
              />
            </div>
          )}

          {formData.bookIDs.map((code, index) => (
            <div className="form-group" key={index}>
              <label>Book code {index + 1}</label>
              <InputField
                type="text"
                value={code}
                disabled={true}
              />
            </div>
          ))}

          {formData.bookIDs.length > 0 && <Button text="Send" />}
        </form>
      </div>
    </>
  );
}

export default BorrowBooks;
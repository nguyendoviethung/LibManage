import { useState } from 'react';
import QRScannerModal from './QRScannerModal';
import ActionButton from '../action-button/ActionButton';
import { bookLendingProcess } from '../../api/LendingService';
function QRScanner() {
 const [showScanner, setShowScanner] = useState(false); // State để điều khiển hiển thị QRScanner ra màn hình 
 const [NotificationBookCode, setNotificationBookCode] = useState(null); // Thông báo khi quét mã Q của sách
 //Gọi APi để mượn sách
  const handleScan = async (data) => {
  try {
    const response = await bookLendingProcess(data);
    console.log("Mượn sách thành công:", response);
   if(response.success) {
      setNotificationBookCode(true); // Hiện thông báo thành công
    }
  } catch (error) {
    console.error("Lỗi mượn sách:", error);
    setNotificationBookCode(false); //Hiện thông báo lỗi
  }
};

  return (
    //Nút quét mã QR
    <div>
      <ActionButton
        onClick={() => setShowScanner(true)}
        label="Quét mã QR"
        className="qr-scan"
      />
    {/* showScanner === true thì hiển thị ra màn hình máy ảnh quét QR*/}
      {showScanner && (
        <QRScannerModal
          onScanSuccess={handleScan}
          onClose={() => setShowScanner(false)}
          NotificationBookCode={NotificationBookCode}
          setNotificationBookCode={setNotificationBookCode}
        />
      )}
    </div>
  );
}

export default QRScanner;
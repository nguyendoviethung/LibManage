import { useState } from 'react';
import BorrowBooks from './BorrowBooks';
import ReturnBooks from './ReturnBooks';
import ActionButton from '../action-button/ActionButton';
import { bookLendingProcess ,bookReturnProcess} from '../../api/LendingService';
function QRScanner() {
 const [borrowBooks, setBorrowBooks] = useState(false); // State để điều khiển hiển thị QRScanner ra màn hình để mượn sách
 const [returnBooks, setReturnBooks] = useState (false)  // State để điều khiển hiển thị QRScanner ra màn hình để trả sách
 const [NotificationBookCode, setNotificationBookCode] = useState(null); // Thông báo khi quét mã QR của sách

 //Gọi APi để mượn sách
  const handleBorrowBooks = async (data) => {
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

 //Gọi APi để xử lí trả sách
  const handleReturnBooks = async (data) => {
  try {
    const response = await bookReturnProcess(data);
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
    <div>
      {/* Phần mượn sách */}
      <ActionButton
        onClick={() => setBorrowBooks(true)}
        label="Mượn sách"
        className="qr-scan"
      />
    {/* borrowBooks === true thì hiển thị ra màn hình máy ảnh quét QR*/}
      {borrowBooks && (
        <BorrowBooks
          onScanSuccess={handleBorrowBooks}
          onClose={() => setBorrowBooks(false)}
        />
      )}

       {/*Phần trả sách  */}
      <ActionButton
        onClick={() => returnBooks(true)}
        label="Trả sách"
        className="qr-scan"
      />
    {/* borrowBooks === true thì hiển thị ra màn hình máy ảnh quét QR*/}
      {returnBooks && (
        <ReturnBooks
          onScanSuccess={handleReturnBooks}
          onClose={() => setReturnBooks(false)}
        />
      )}
    </div>
  );
}

export default QRScanner;
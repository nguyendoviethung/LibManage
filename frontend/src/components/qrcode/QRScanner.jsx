import { useState } from 'react';
import BorrowBooks from './BorrowBooks';
import ReturnBooks from './ReturnBooks';
import ActionButton from '../action-button/ActionButton';
import { bookLendingProcess, bookReturnProcess } from '../../api/LendingService';
import AlertBox from '../alert-box/AlertBox';

function QRScanner() {
  const [borrowBooks, setBorrowBooks] = useState(false);
  const [returnBooks, setReturnBooks] = useState(false);
  const [notification, setNotification] = useState(null);

  // Xử lý mượn sách
  const handleBorrowBooks = async (data) => {
    try {
      const response = await bookLendingProcess(data);
      console.log("Mượn sách thành công:", response);
      if (response.success) {
        setNotification({ message: response.message, type: "success" });
      } else {
        setNotification({ message: response.message, type: "error" });
      }
    } catch (error) {
      console.error("Lỗi mượn sách:", error);
      setNotification({ message: "Đã xảy ra lỗi khi mượn sách.", type: "error" });
    }
  };

  // Xử lý trả sách
  const handleReturnBooks = async (data) => {
    try {
      const response = await bookReturnProcess(data);
      console.log("Trả sách thành công:", response);
      if (response.success) {
        setNotification({ message: response.message, type: "success" });
      } else {
        setNotification({ message: response.message, type: "error" });
      }
    } catch (error) {
      console.error("Lỗi trả sách:", error);
      setNotification({ message: "Đã xảy ra lỗi khi trả sách.", type: "error" });
    }
  };

  return (
    <div>
      {/* Hiển thị thông báo nếu có */}
      {notification && (
        <AlertBox
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    <div className="d-flex justify-content-center gap-4 my-4">
      {/* Nút mượn sách */}
      <ActionButton
        onClick={() => setBorrowBooks(true)}
        label="Mượn sách"
        className="qr-scan"
      />

      {borrowBooks && (
        <BorrowBooks
          handleBorrowBooks ={handleBorrowBooks}
          onClose={() => setBorrowBooks(false)}
        />
      )}

      {/* Nút trả sách */}
      <ActionButton
        onClick={() => setReturnBooks(true)}
        label="Trả sách"
        className="qr-scan"
      />

      {returnBooks && (
        <ReturnBooks
          handleReturnBooks ={handleReturnBooks}
          onClose={() => setReturnBooks(false)}
        />
      )}
      </div>
    </div>
  );
}

export default QRScanner;

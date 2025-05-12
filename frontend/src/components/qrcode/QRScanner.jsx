import { useState } from 'react';
import QRScannerModal from './QRScannerModal';
import ActionButton from '../action-button/ActionButton';

function QRScanner() {
  // State để điều khiển hiển thị QRScanner ra màn hình 
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (data) => {
    console.log("QR content:", data);
    // TODO: xử lý data sau khi quét
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
        />
      )}
    </div>
  );
}

export default QRScanner;
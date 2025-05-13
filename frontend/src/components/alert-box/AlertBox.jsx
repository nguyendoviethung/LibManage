import { useEffect } from 'react';

function AlertBox({ message, type, onClose }) {
  const color1 = type === 'success' ? '#00ad1d' : '#ff0000'; // màu xanh lá cây cho thành công, đỏ cho lỗi
  const color2 = type === 'success' ? '#8dfc9f' : '#f09998';

    useEffect(() => {
      const timer = setTimeout(() => {
        onClose(); // Set lại state cho cha để ẩn AlertBox (gọi sau 2 giây)
      }, 3000);
      return () => clearTimeout(timer); // Nếu dùng return clearTimeout(timer) thì sẽ chạy luôn hàm này khi setTimeout mà không cần phải đợi 2 giây
    }, [onClose]);

  return (
    <div style={{ 
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: `linear-gradient(270deg, ${color1}, ${color2}, ${color1})`,
      backgroundSize: '400% 400%',
      animation: 'gradientMove 2s linear forwards',
      color: 'white',
      padding: '18px 24=6px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 9999,
      minWidth: '280px',
      textAlign: 'center'
    }}>
      {message}

      <style>
        {`
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }
        `}
      </style>
    </div>
  );
}

export default AlertBox;

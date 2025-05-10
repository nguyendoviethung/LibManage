import React, { useEffect } from 'react';

function AlertBox({ message, type = 'success', onClose }) {
  const color1 = type === 'success' ? '#00ad1d' : '#ff0000';
  const color2 = type === 'success' ? '#8dfc9f' : '#f09998';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // đóng sau 2 giây
    }, 2000);
    return () => clearTimeout(timer);
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
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
      zIndex: 9999,
      minWidth: '250px',
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

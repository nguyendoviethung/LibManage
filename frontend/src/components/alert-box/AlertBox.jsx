import { useEffect } from 'react';

function AlertBox({ message, type, onClose }) {
  const color1 = type === 'success' ? '#00ad1d' : '#ff0000';
  const color2 = type === 'success' ? '#8dfc9f' : '#f09998';

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Ẩn AlertBox sau 2s
    }, 2000);
    return () => clearTimeout(timer); // Clear timeout khi unmount
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: `linear-gradient(270deg, ${color1}, ${color2}, ${color1})`,
        backgroundSize: '400% 400%',
        animation: 'gradientMove 2s linear forwards',
        color: 'white',
        padding: '16px 22px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        zIndex: 9999,
        width: '400px',
        minHeight: '80px',
        fontSize: '16px',
        lineHeight: '1.5',
        fontWeight: '400',
        textAlign: 'center',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
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

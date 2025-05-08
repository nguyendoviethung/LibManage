import React, { useState } from 'react';
import './UserAvatar.scss';
import logoImg from '../../../assets/images/logo.jpg'; // đường dẫn từ Logo.jsx đến file ảnh
const UserAvatar = () => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    console.log('Logged out'); // Xử lý logout ở đây
    setOpen(false);
  };

  return (
    <div className="user-avatar">
      <img
        src={logoImg} // 👉 Thay đường dẫn ảnh avatar nếu khác
        alt="User Avatar"
        onClick={toggleMenu}
      />
      {open && (
        <div className="dropdown-menu">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div >
  );
};

export default UserAvatar;

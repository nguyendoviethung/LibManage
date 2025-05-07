import React, { useState } from 'react';
import './UserAvatar.scss';

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
        src="/assets/avatar.jpg" // 👉 Thay đường dẫn ảnh avatar nếu khác
        alt="User Avatar"
        onClick={toggleMenu}
      />
      {open && (
        <div className="dropdown-menu">
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

import React from 'react';
import Logo from './logo/Logo';
import NotificationIcon from './NotificationIcon/NotificationIcon';
import UserAvatar from './UserAvatar/UserAvatar';
import './Navbar.scss';

const Navbar = () => {
  return (
    <div className="navbar">
      <Logo />
      <div className="navbar-right">
        <NotificationIcon count={3} /> {/* Giả sử có 3 thông báo */}
        <UserAvatar />
      </div>
    </div>
  );
};

export default Navbar;

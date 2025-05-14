import Logo from './logo/Logo';
import NotificationIcon from './notificationicon/NotificationIcon';
import UserAvatar from './useravatar/UserAvatar';
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

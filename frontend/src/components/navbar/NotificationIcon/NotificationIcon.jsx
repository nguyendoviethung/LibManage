import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import './NotificationIcon.scss';
function NotificationIcon({count}) {
  return (
    <div className="bell-icon">
      <FontAwesomeIcon icon={faBell} />
      {count > 0 && <span className="notification-count">{count}</span>}
    </div>
  );
};

export default NotificationIcon;

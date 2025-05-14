import './NotificationIcon.scss'; // Import style riêng

function NotificationIcon({ count}) {
  return (
    <div className="notification-icon">
      <i className="bi bi-bell"></i> {/* Bootstrap Icons */}
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
};

export default NotificationIcon;

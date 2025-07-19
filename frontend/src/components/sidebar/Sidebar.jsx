import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { menuItemsAdmin, menuItemsUser } from './MenuItems'; 
import './Sidebar.scss';

export function SidebarAdmin() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItemsAdmin.map(item => ( //Lặp qua các item trong menuItems và tạo ra các thẻ <li> cho từng item
          <li key={item.path} >
            {/* Sử dụng Link từ react-router-dom để điều hướng đến các trang khác */}
            <Link to={item.path} className="menu-link">
              <FontAwesomeIcon icon={item.icon} className = "sidebar-icon" />
              <span className = "item-label"> {item.label} </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SidebarUser() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        { menuItemsUser.map(item => ( //Lặp qua các item trong menuItems và tạo ra các thẻ <li> cho từng item
          <li key={item.path}>
            <Link to={item.path} className="menu-link">
              <FontAwesomeIcon icon={item.icon} style={{ marginRight: '12px' }} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
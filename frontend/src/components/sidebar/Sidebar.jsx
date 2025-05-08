import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { menuItems } from './MenuItems'; 
import './Sidebar.scss';

function Sidebar() {
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map(item => ( //Lặp qua các item trong menuItems và tạo ra các thẻ <li> cho từng item
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

export default Sidebar;

import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { menuItemsAdmin, menuItemsUser } from './MenuItems'; 
import './Sidebar.scss';
import { useEffect,useState } from 'react';
import { jwtDecode } from "jwt-decode";

export function SidebarAdmin() {
  const location = useLocation();
  
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItemsAdmin.map(item => (
          <li key={item.path}>
            <Link 
              to={item.path} 
              className={`menu-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
              <span className="item-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SidebarUser() {
  const location = useLocation();
  const [id, setId] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded);
      setId(decoded.data.id);
    } catch (err) {
      console.error("Token decode error:", err);
    }
  }, []);
  
  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItemsUser.map(item => (
          <li key={item.label}>
            <Link 
              to={id ? item.buildPath(id) : "#"} 
              className={`menu-link ${location.pathname === (id ? item.buildPath(id) : "#") ? 'active' : ''}`}
            >
              <FontAwesomeIcon icon={item.icon} className="sidebar-icon" />
              <span className="item-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
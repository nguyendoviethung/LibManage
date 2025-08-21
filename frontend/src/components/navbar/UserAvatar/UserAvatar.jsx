  import  { useState } from 'react';
  import './UserAvatar.scss';
  import logoImg from '../../../assets/images/logo.jpg'; // đường dẫn từ Logo.jsx đến file ảnh
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
  import { useNavigate } from "react-router-dom";

  const UserAvatar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
      setOpen(!open);   //Xử lí mở Toggle
    };

    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('userID');

       navigate('/'); // chuyển về trang login
    }
   return (
  <div className="user-avatar">
    <img
      src={logoImg} // Thay đường dẫn ảnh avatar nếu khác
      alt="User Avatar"
      onClick={toggleMenu}
    />
    {open && (
      <div className="dropdown-menu">
        <button onClick = {handleLogout}
                onBlur = {()=>{
                  setOpen(false)
                }}
        >
          <div className = "logout-wrapper">
          <FontAwesomeIcon icon={faSignOutAlt} className="me-2 icon-logout" /> {/* me-2: margin-right */}
          <div className = "logout-label">Logout</div>
          </div>
        </button>
      </div>
    )}
  </div>
);
  };

  export default UserAvatar;

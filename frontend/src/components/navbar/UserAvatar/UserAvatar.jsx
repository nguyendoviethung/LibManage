  import  { useState } from 'react';
  import './UserAvatar.scss';
  import logoImg from '../../../assets/images/logo.jpg'; // đường dẫn từ Logo.jsx đến file ảnh
  import axios from "axios";
  import { useNavigate } from "react-router-dom";

  const UserAvatar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
      setOpen(!open);   //Xử lí mở Toggle
      console.log("Click vào avatar",open)
    };

    const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost/LibManage/backend/api/auth/logout.php', {}, {
        withCredentials: true 
      });

      const data = response.data;
    
      if (data.success) {
        console.log('Logged out');
        
        navigate('/'); // chuyển về trang login
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

    return (
      <div className="user-avatar">
        <img
          src={logoImg} // Thay đường dẫn ảnh avatar nếu khác
          alt="User Avatar"
          onClick={toggleMenu}
        />
        {open && (
          <div className="dropdown-menu">
           <button onClick={() => handleLogout()}>Logout</button>
          </div>
        )}
      </div >
    );
  };

  export default UserAvatar;

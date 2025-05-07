import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ sử dụng để chuyển hướng nội bộ
import axios from 'axios';
import LoginForm from '../../components/LoginForm/LoginForm';
import TextHeader from '../../components/TextHeader/TextHeader';
import "./LoginBackground.scss"
// Nếu background riêng → import file riêng

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        'http://localhost/LibManage/api/auth/login.php',
        {
          loginUsername: username,
          loginPassword: password
        },
        {
          withCredentials: true // Cho phép cookie đi kèm
        }
      );

      const data = response.data;

      if (data.success) {
        const role = data.role;
        const userID = data.userID;
      
        if (role === 'admin') {
          navigate(`/dashboard/admin`);
        } else {
          navigate(`/dashboard/user/${userID}`);
        }
      }
       else {
        alert(data.message || 'Đăng nhập thất bại.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Đã có lỗi xảy ra khi kết nối đến máy chủ.');
    }
  };

  return (
  <div className = "login-background">
      <TextHeader text="Welcome to Global Connectivity University of Technology" />
      <div className="login-container">
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
       </div>
  </div>
  );
}

export default Login;

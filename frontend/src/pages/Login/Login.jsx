import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ sử dụng để chuyển hướng nội bộ
import axios from 'axios';
import LoginForm from '../../components/LoginForm';
import TextHeader from '../../components/TextHeader';

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
          withCredentials: true // ✅ cho phép cookie đi kèm
        }
      );

      const data = response.data;

      if (data.success) {
        navigate('/dashboard')
      } else {
        alert(data.message || 'Đăng nhập thất bại.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Đã có lỗi xảy ra khi kết nối đến máy chủ.');
    }
  };

  return (
    <div className="login-page">
      <TextHeader text="Welcome to Global Connectivity University of Technology" />
      <LoginForm
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
    </div>
  );
}

export default Login;

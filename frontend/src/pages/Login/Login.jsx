import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // sử dụng để chuyển hướng nội bộ
import axios from 'axios';
import LoginForm from '../../components/loginform/LoginForm';
import AlertBox from '../../components/alert-box/AlertBox';
import FooterLogin from '../../components/footer/FooterLogin';
import HeaderLogin from '../../components/header/HeaderLogin';
import "./LoginBackground.scss"
 
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus,setLoginStatus] = useState(false)
  const navigate = useNavigate(); // sử dụng để chuyển hướng nếu đăng nhập thành công

  //Hàm xử lí khi người dùng nhấn nút Đăng Nhập 
  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      const response = await axios.post(
        'http://localhost/LibManage/backend/api/auth/login.php',
        {
          loginUsername: username.trim(),
          loginPassword: password.trim()
        },
        {
          withCredentials: true // Cho phép cookie đi kèm
        }
      );

      const data = response.data;

      if (data.success) {
        const role = data.role 
        const userID = data.userID 
        const token = data.token
        console.log(data) 
        localStorage.setItem("token", token); 
        if (role === 'admin') {
          navigate(`/admin-dashboard`,{ replace: true });
        } else {
          navigate(`/user/${userID}`,{ replace: true })
        }
      }
       else {
        setLoginStatus(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Đã có lỗi xảy ra khi kết nối đến máy chủ.')
    }
  };
  
  return (
    <>
      {loginStatus && (
        <AlertBox
          message= "Tài khoản hoặc mật khẩu không chính xác"
          type= "error"
          onClose={() => setLoginStatus(false)}
        /> 
      )}
        
    <HeaderLogin />

     <div className = "login-background">
        <div className="login-container">
          <LoginForm
          username={username}
          password={password}
          setUsername={setUsername}
          setPassword={setPassword}
          onSubmit={handleLogin}
          />
        </div>
      </div>

    <FooterLogin />
    </>
    );
}

export default Login;

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
          loginUsername: username,
          loginPassword: password
        },
        {
          withCredentials: true // Cho phép cookie đi kèm
        }
      );

      const data = response.data;

      if (data.success) {
        const role = data.role // Phân quyền 
        const userID = data.userID // Mã số sinh viên 
        localStorage.setItem("userID", userID); // Lưu UserID vào storage
        if (role === 'admin') {
          navigate(`/admin-dashboard`,{ replace: true });
          // { replace: true } là một tùy chọn (option) truyền vào hàm navigate() của React Router, để thay thế URL hiện tại thay vì thêm mới vào lịch sử (history stack).
          //  Điều hướng đến /ad  min-dashboard, nhưng không lưu trang hiện tại (/login) vào lịch sử trình duyệt
          //  => Khi nhấn back không quay lại trang login được 
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

import './HeaderLogin.scss'
import Logo from '../navbar/logo/Logo';
export default function HeaderLogin() {
  return (
    <header className="login-header">
      <div className="header-content">
        <Logo />
        <div>
          <div className="header-title">ĐẠI HỌC CÔNG NGHỆ KẾT NỐI TOÀN CẦU</div>
          <div className="header-subtitle">THƯ VIỆN TRI THỨC</div>
        </div>
      </div>
    </header>
  );
}

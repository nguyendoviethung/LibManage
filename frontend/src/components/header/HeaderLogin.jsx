import './HeaderLogin.scss'
import Logo from '../navbar/logo/Logo';
export default function HeaderLogin() {
  return (
    <header className="login-header">
      <div className="header-content">
        <Logo />
        <div>
          <div className="header-title">GLOBAL CONNECTED TECHNOLOGY UNIVERSITY</div>
          <div className="header-subtitle">LIBRARY OF KNOWLEDGE</div>
        </div>
      </div>
    </header>
  );
}

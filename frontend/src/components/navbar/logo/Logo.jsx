import './Logo.scss';
import logoImg from '../../../assets/images/logo.jpg'; // đường dẫn từ Logo.jsx đến file ảnh

const Logo = () => {
  return (
    <div className="logo">
      <img src={logoImg} alt="School Logo" />
    </div>
  );
};

export default Logo;

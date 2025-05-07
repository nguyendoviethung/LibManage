import React from 'react';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';  
import "./LoginForm.scss"
import 'bootstrap-icons/font/bootstrap-icons.css';

function LoginForm({ username, setUsername, password, setPassword, onSubmit }) {
  return (
 <div>
    <form className="login-form" onSubmit={onSubmit}>
      <h3 className="text-center mb-4">Login</h3>

      <InputField
        type="text" 
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        iconClass="bi-person"
      />

      <InputField
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        iconClass="bi-lock"
      />

      <Button text = "Đăng Nhập" />

      <div className="text-center mt-3">
        <a href="#" className="forgot-password">Forgot password?</a>
      </div>
    </form>
  </div>
  );
}

export default LoginForm;

import React from 'react';
import InputField from './InputField';

function LoginForm({ username, setUsername, password, setPassword, onSubmit }) {
  return (
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

      <button type="submit" className="login-btn">Đăng nhập</button>

      <div className="text-center mt-3">
        <a href="#" className="forgot-password">Forgot password?</a>
      </div>
    </form>
  );
}

export default LoginForm;

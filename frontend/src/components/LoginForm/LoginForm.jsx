import "./LoginForm.scss";
import InputField from "../inputfield/InputField";
import Button from "../button/Button";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';

function LoginForm({ username, setUsername, password, setPassword, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
    
  return (
    <div>
      <form className="login-form" onSubmit={onSubmit}>
        <h3 className="text-center mb-4">System Login</h3>
      {/* Input Username  */}
      <div className="input-wrapper">
        <InputField
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          disabled={false}
          iconLeft={<FontAwesomeIcon icon={faUser} />}
        />
      </div>
    
      {/* Input Password  */}
      <div className="input-wrapper">
        <InputField
          type={showPassword ? "text" : "password"} 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          disabled={false}
          iconLeft={<FontAwesomeIcon icon={faLock} />}
        />

      {/* Icon eye của password */}
          <span
            className="input-icon-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
          </span>
        </div>  

        <Button text = "Login" />

        <div className="text-center mt-3">
          <a href="#" className="forgot-password">Forgot password?</a>
        </div>  
      </form>
    </div>
  );
}

export default LoginForm;

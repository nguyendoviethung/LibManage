  import "./LoginForm.scss";
  import InputField from "../inputfield/InputField";
  import Button from "../button/Button";  
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import { faEye, faEyeSlash, faUser, faLock } from "@fortawesome/free-solid-svg-icons";
  import { useState, useRef } from 'react';

  function LoginForm({ username, setUsername, password, setPassword, onSubmit }) {
    const [showPassword, setShowPassword] = useState(false);
    const inputRef_1 = useRef(null);
    const inputRef_2 = useRef(null);

    const handleKeyDown_1 = (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        inputRef_2.current.focus();
      }
    }
    
    const handleKeyDown_2 = (e) => {
      if (e.key === 'Enter') {
        onSubmit(e); 
      }
    }
    return (
      <div>
        <form className="login-form" onSubmit={onSubmit}>
          <h3 className="text-center mb-4">System Login</h3>
        {/* Input Username */}
        <div className="input-wrapper">
          <InputField
            ref = {inputRef_1}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            onKeyDown={handleKeyDown_1}
            iconLeft={<FontAwesomeIcon icon={faUser} />}
          />
        </div>
      
        <div className="input-wrapper">
          <InputField
            ref = {inputRef_2}
            type={showPassword ? "text" : "password"} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            iconLeft={<FontAwesomeIcon icon={faLock} />}
            onKeyDown={handleKeyDown_2}
          />

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

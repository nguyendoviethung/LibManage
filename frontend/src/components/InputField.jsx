import React from 'react';

function InputField({ type, value, onChange, placeholder, iconClass }) {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <i className={`bi ${iconClass} icon-right`}></i>
    </div>
  );
}

export default InputField;

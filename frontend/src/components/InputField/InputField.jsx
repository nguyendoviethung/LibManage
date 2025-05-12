import "./InputField.scss";

function InputField({ type, value, onChange, placeholder, iconClass, disabled = false}) {
  return (
    <div className="input-wrapper">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled} // ✅ Thêm dòng này
        required
      />
      <i className={`bi ${iconClass} icon-right`}></i>
    </div>
  );
}

export default InputField;

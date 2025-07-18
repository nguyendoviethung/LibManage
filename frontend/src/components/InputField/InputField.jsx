import "./InputField.scss";

function InputField({ type, value, onChange, placeholder, iconLeft, disabled = false }) {
  return (
    <>
      {iconLeft && <span className="input-icon-left">{iconLeft}</span>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required
      />
    </>
  );
}

export default InputField;
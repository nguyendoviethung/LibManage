import "./InputField.scss";

function InputField({ref, type, value, onChange, placeholder, iconLeft, onKeyDown }) {
  return (
    <>
      {iconLeft && <span className="input-icon-left">{iconLeft}</span>}
      <input
        ref = {ref}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={onKeyDown}
        required
      />
    </>
  );
}

export default InputField;
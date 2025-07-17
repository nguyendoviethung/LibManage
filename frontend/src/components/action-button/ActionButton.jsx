  import './ActionButton.scss'
  function ActionButton({ onClick, label = "Thêm", icon = null, className = ""}) {
    return (
      <div
        onClick={onClick}
        className="action-button"
      >
        {icon && <span style={{ marginRight: '8px' }}>{icon}</span>}
        {label}
      </div>  
    );
  }

  export default ActionButton;

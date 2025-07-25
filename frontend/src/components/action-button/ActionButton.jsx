  import './ActionButton.scss';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { Button } from 'react-bootstrap';
  function ActionButton({ onClick, label, icon, className }) {
    return (
      <button
        variant="none"
        className= {`action-button ${className}`}
        onClick= {onClick}
         >
        <FontAwesomeIcon icon={icon} style={{marginRight: 6}} /> {label}
      </button>
    );
  }

  export default ActionButton;

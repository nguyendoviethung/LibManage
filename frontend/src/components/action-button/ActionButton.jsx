  import './ActionButton.scss';
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { Button } from 'react-bootstrap';
  function ActionButton({ onClick, label, icon, className }) {
    return (
      <Button
                className= {`action-button ${className}`}
                onClick= {onClick}
              >
                <FontAwesomeIcon icon={icon} style={{marginRight: 6}} /> {label}
              </Button>
    );
  }

  export default ActionButton;

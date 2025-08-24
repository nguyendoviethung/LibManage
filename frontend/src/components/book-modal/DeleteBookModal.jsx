import { Modal, Button } from 'react-bootstrap';
import  '../reader-modal/Modal.scss';

function DeleteBookModal({ show, hide, bookData, handleDelete}) {
  const handleConfirmDelete =  async(e) =>{
    e.preventDefault();
    await handleDelete(bookData.book_id); 
    hide(); 
  };
  

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Confirm book deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Are you sure you want to delete  <strong>{bookData?.title}</strong> ?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button className ="delete-book-refuse" onClick={hide}>
          No
        </Button>
        <Button className="delete-book-accept" onClick={handleConfirmDelete}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteBookModal;

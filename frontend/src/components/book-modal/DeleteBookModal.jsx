import { Modal, Button } from 'react-bootstrap';

function DeleteBookModal({ show, hide, bookData, handleDelete}) {
  const handleConfirmDelete =  async(e) =>{
    e.preventDefault();
    await handleDelete(bookData.book_id); 
    hide(); 
  };
  

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xoá sách</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Bạn có chắc chắn muốn xoá sách <strong>{bookData?.title}</strong> không?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>
          Không
        </Button>
        <Button variant="danger" onClick={handleConfirmDelete}>
          Có
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteBookModal;

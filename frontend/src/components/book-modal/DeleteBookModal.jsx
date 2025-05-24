import { Modal, Button } from 'react-bootstrap';

function DeleteBookModal({ show, hide, bookData, handleDelete }) {
  const handleConfirmDelete = () => {
    handleDelete(bookData.book_id); // Gọi hàm xóa với ID của sách
    hide(); // Đóng modal sau khi gọi
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

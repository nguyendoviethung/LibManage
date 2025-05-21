import { Modal, Button } from 'react-bootstrap';

function AccountNotice({ show, onHide, onConfirm }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Bạn có muốn tiếp tục tạo tài khoản thư viện cho sinh viên hay không?
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Không
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Có
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AccountNotice;
    
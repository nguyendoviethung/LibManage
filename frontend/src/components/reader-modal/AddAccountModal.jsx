import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';
import AlertBox from '../alert-box/AlertBox';
function AddAccountModal({ show, onHide,  handleAddAccount }) {
  const [account, setAccount] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  
 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAccount((prev) => ({
      ...prev,
      [name]: value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  const result = await handleAddAccount(account);
  if (result) {
    setAccount({ username: '', password: '', confirmPassword: '' }); // reset
    onHide(); // chỉ đóng modal nếu tạo thành công
  }
};

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Tạo tài khoản thư viện</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={account.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={account.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={account.confirmPassword}
              onChange={handleChange}
              placeholder="Xác nhận lại mật khẩu"
              required
            />
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="primary" type="submit">
            Tạo tài khoản
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddAccountModal;

import { Modal, Button, Form } from 'react-bootstrap';
import { useState } from 'react';

function AddAccountModal({ show, onHide, onCreate }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (account.password !== account.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }

    // Gửi dữ liệu tạo tài khoản
    onCreate(account);
    setAccount({ username: '', password: '', confirmPassword: '' }); // reset
    onHide(); // đóng modal
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
          <Button variant="secondary" onClick={onHide}>
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            Tạo tài khoản
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddAccountModal;

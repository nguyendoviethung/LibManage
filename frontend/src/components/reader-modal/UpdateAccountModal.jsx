import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';

function UpdateAccountModal({ show, onHide, accountData, handleUpdateAccount }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    status: ''
  });

 // Khi modal hiện ra thì tự động điền  username và status của người dùng 
  useEffect(() => {
    if (accountData) {
      setForm({
        username: accountData.username,
        password: '',
        confirmPassword: '',
        status: 'Active',
      });
    }
  }, [accountData]);

  //Xử lí khi khi input thay đổi 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  //Xử lí khi submit form
 const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    confirmPassword: form.confirmPassword,
    password: form.password || null,
    username: form.username,
    status: form.status
  };
  
  //Gọi hàm handUpdateAccount và đợi nó hoàn thiện xong thì xem kết quả nếu thành công thì đóng modal và reset state
  const success = await handleUpdateAccount(payload);
  if (success) {
    onHide();
    setForm({ username: '', password: '', confirmPassword: '', status: '' });
  }
};


  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật tài khoản</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên đăng nhập</Form.Label>
            <Form.Control type="text" value={form.username} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới (bỏ qua nếu không đổi)</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu mới"
              autoComplete="new-password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Xác nhận mật khẩu</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Xác nhận mật khẩu"
              autoComplete="new-password"

            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Trạng thái</Form.Label>
            <Form.Select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Banned">Banned</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Huỷ</Button>
          <Button variant="primary" type="submit">Cập nhật</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateAccountModal;

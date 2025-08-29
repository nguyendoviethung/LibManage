import { Modal, Button, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import {getUserName} from '../../api/ReaderManagementAPI';

function UpdateAccountModal({ show, onHide, readerData, handleUpdateAccount, token}) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    status: ''
  });
 
//  Khi modal hiện ra thì tự động điền  username và status của người dùng 
useEffect(() => {
  const fetchUsername = async () => {
    try {
      const res = await getUserName({student_id : readerData.student_id}, token); 
      console.log(res.data)
      if (res.success) {
        setForm(prev => ({ ...prev, username: res.data.username , status: res.data.status}));
      }else{
        console.log(res)
      }
    } catch (err) {
      console.error("Lỗi khi lấy username:", err);
    }
  };

  if (readerData?.student_id) {
    fetchUsername();
  }
}, []);

  //Xử lí khi khi input thay đổi 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  //Xử lí khi submit form
const handleSubmit = async (e) => {
  e.preventDefault();
  const payload = {
    password: form.password.trim() || null, 
    username: form.username,
    status: form.status
  };

  const result = await handleUpdateAccount(readerData.student_id, payload);
  if (result.success) {
    onHide();
    setForm({ username: '', password: '', confirmPassword: '', status: '' });
  }
};

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update account</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>User name</Form.Label>
            <Form.Control type="text" value={form.username} disabled />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>New password (skip if not changed)</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter new password"
              autoComplete="new-password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm new password</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              autoComplete="new-password"

            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Disabled">Disabled</option>
              <option value="Banned">Banned</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button className = "update-account-reader" type="submit">Update</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateAccountModal;

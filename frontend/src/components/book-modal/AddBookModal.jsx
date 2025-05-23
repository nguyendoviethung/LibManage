import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { addBook } from '../../api/BookManagementAPI';

function AddBookModal({ show, hide, setAlertBox }) {
  const [formData, setFormData] = useState({
    title: '',
    lang: '',
    publisher_year: '',
    location: '',
    quantity: '',
    author_name: '',
    genre: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await addBook(formData);
    if (res.success) {
      setAlertBox({ message: 'Thêm sách thành công!', type: 'success' });
      hide();
    } else {
      setAlertBox({ message: res.message || 'Thêm sách thất bại!', type: 'error' });
    }
  };

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Thêm sách</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên sách</Form.Label>
            <Form.Control type="text" name="title" value={formData.title} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Ngôn ngữ</Form.Label>
            <Form.Control type="text" name="lang" value={formData.lang} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Năm xuất bản</Form.Label>
            <Form.Control type="number" name="publisher_year" value={formData.publisher_year} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Vị trí</Form.Label>
            <Form.Control type="text" name="location" value={formData.location} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Số lượng</Form.Label>
            <Form.Control type="number" name="quantity" value={formData.quantity} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tác giả</Form.Label>
            <Form.Control type="text" name="author_name" value={formData.author_name} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Thể loại</Form.Label>
            <Form.Control type="text" name="genre" value={formData.genre} onChange={handleChange} required />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={hide}>Hủy</Button>
          <Button variant="success" type="submit">Thêm sách</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default AddBookModal;

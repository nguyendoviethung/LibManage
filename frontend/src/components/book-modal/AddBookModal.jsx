import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function AddBookModal({ show, hide, addBook}) {
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
    if( await addBook(formData)){
      setFormData({
    title: '',
    lang: '',
    publisher_year: '',
    location: '',
    quantity: '',
    author_name: '',
    genre: ''
      })
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
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          placeholder="Nhập vào tên sách"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Ngôn ngữ</Form.Label>
        <Form.Control
          type="text"
          name="lang"
          value={formData.lang}
          placeholder="Nhập vào ngôn ngữ"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Năm xuất bản</Form.Label>
        <Form.Control
          type="number"
          name="publisher_year"
          value={formData.publisher_year}
          placeholder="Nhập vào năm xuất bản"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Vị trí</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          placeholder="Nhập vào vị trí"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Số lượng</Form.Label>
        <Form.Control
          type="number"
          name="quantity"
          value={formData.quantity}
          placeholder="Nhập vào số lượng"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Tác giả</Form.Label>
        <Form.Control
          type="text"
          name="author_name"
          value={formData.author_name}
          placeholder="Nhập vào tên tác giả"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Thể loại</Form.Label>
        <Form.Control
          type="text"
          name="genre"
          value={formData.genre}
          placeholder="Nhập vào thể loại sách"
          onChange={handleChange}
          required
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="success" type="submit">Thêm sách</Button>
    </Modal.Footer>
  </Form>
</Modal>

  );
} 

export default AddBookModal;

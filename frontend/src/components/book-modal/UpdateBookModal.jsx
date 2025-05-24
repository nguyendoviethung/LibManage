import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UpdateBookModal({ show, hide, handleUpdate, bookData }) {
  const [formData, setFormData] = useState({
    book_id: '',
    title: '',
    lang: '',
    publisher_year: '',
    location: '',
    quantity: '',
    author_name: '',
    genre: ''
  });

  // Gán dữ liệu ban đầu từ selectedBook mỗi khi modal mở
  useEffect(() => { 
    if (show && bookData) {
      setFormData({ ...bookData });
    }
  }, [show, bookData]);

  //Xử lí khi input thay đổi
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Xử lí khi submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleUpdate(formData);
    if (success) hide();
  };

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật sách</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên sách</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              placeholder="Nhập tên sách"
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
              placeholder="Nhập ngôn ngữ"
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
              placeholder="Nhập năm xuất bản"
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
              placeholder="Nhập vị trí sách"
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
              placeholder="Nhập số lượng"
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
              placeholder="Nhập tên tác giả"
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
              placeholder="Nhập thể loại sách"
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
         
          <Button variant="info" type="submit">Cập nhật</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateBookModal;

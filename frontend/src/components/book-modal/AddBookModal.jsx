import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import  '../reader-modal/Modal.scss';

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
  const trimmedData = {
    ...formData,
    title: formData.title.trim(),
    lang: formData.lang.trim(),
    location: formData.location.trim(),
    author_name: formData.author_name.trim(),
    genre: formData.genre.trim(),
  };
 if( addBook(trimmedData)){
  setFormData({
    title: '',
    lang: '',
    publisher_year: '',
    location: '',
    quantity: '',
    author_name: '',
    genre: ''
  })
 };
};

  return (
   <Modal show={show} onHide={hide} centered>
  <Modal.Header closeButton>
    <Modal.Title>Add books</Modal.Title>
  </Modal.Header>
  <Form onSubmit={handleSubmit}>
    <Modal.Body>
      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          placeholder="Enter the book name"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Language</Form.Label>
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
        <Form.Label>Year of publication</Form.Label>
        <Form.Control
          type="number"
          name="publisher_year"
          value={formData.publisher_year}
          placeholder="Enter year of publication"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Location</Form.Label>
        <Form.Control
          type="text"
          name="location"
          value={formData.location}
          placeholder="Enter location"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Quantity</Form.Label>
        <Form.Control
          type="number"
          name="quantity"
          value={formData.quantity}
          placeholder="Enter quantity"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Author</Form.Label>
        <Form.Control
          type="text"
          name="author_name"
          value={formData.author_name}
          placeholder="Enter Author"
          onChange={handleChange}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Control
          type="text"
          name="genre"
          value={formData.genre}
          placeholder="Enter book category"
          onChange={handleChange}
          required
        />
      </Form.Group>
    </Modal.Body>
    <Modal.Footer>
      <Button className = "add-book-modal" type="submit">Add Book</Button>
    </Modal.Footer>
  </Form>
</Modal>

  );
} 

export default AddBookModal;

import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function BookFormModal({ show, onSubmit,hide}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    console.log('Form submitted:', data);
    onSubmit(data);  // Gọi lại cha để xử lí dữ liệu thu được
    form.reset(); // Reset form sau khi submit
    
  };
  
  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Book</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBookTitle">
            <Form.Label>Book Title</Form.Label>
            <Form.Control type="text" name="title" placeholder="Enter the book name" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formAuthor">
            <Form.Label>Author name</Form.Label>
            <Form.Control type="text" name="author" placeholder="Enter author name" required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLanguage">
            <Form.Label>Language</Form.Label>
            <Form.Control type="text" name="language" placeholder="Enter book language" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formYear">
            <Form.Label>Publish Year</Form.Label>
            <Form.Control type="number" name="year" placeholder="Enter publish year" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="location" placeholder="Enter location" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formGenre">
            <Form.Label>Genre</Form.Label>
            <Form.Control type="text" name="genre" placeholder="Enter genre" />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control type="number" name="quantity" placeholder="Enter quantity" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BookFormModal;

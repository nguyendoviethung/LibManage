import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ReaderModal() {
  const [show, setShow] = useState(false);

  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [faculty,setFaculty] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const studentData = {
      studentId,
      fullName,
      email,
      phone,
      faculty,
    };
    console.log('Dữ liệu sinh viên:', studentData);

    // TODO: gửi về backend nếu cần

    // Sau khi lưu → tắt modal và reset form
    setShow(false);
    setStudentId('');
    setFullName('');
    setEmail('');
    setPhone('');
   setFaculty('');
  };

  return (
    <>
      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sinh viên</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Mã sinh viên</Form.Label>
              <Form.Control
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Nhập mã sinh viên"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Nhập họ tên"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Nhập số điện thoại"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngành học</Form.Label>
              <Form.Control
                type="text"
                value={faculty}
                onChange={(e) =>setFaculty(e.target.value)}
                placeholder="Nhập ngành học"
              />
            </Form.Group>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShow(false)}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              Lưu
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ReaderModal;

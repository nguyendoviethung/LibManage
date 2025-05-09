import React, { useState } from 'react';
import BookFormModal from './BookFormModal';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';

function BookManagementPage() {
  const [showModal, setShowModal] = useState(false);

  const handleSave = (data) => {
    console.log('Data saved:', data);
   // Gọi API để lưu dữ liệu vào cơ sở dữ liệu
   axios.post('http://localhost/LibManage/api/book/add-book.php', data)
      .then(response => {
        console.log('Book added successfully:', response.data);
        // Có thể thêm logic để cập nhật lại danh sách sách hoặc thông báo thành công
      })
      .catch(error => {
        console.error('Error adding book:', error);
      });
    setShowModal(false); // Đóng modal sau khi lưu dữ liệu
   
  };

  return (
    <Container className="mt-4">
      <Button variant="primary" onClick={() => setShowModal(true)}>Add Book</Button>
      <BookFormModal
        show={showModal}
        onSubmit={handleSave}
        hide ={() => setShowModal(false)} // Nếu nhấn nút "X" thì sẽ gọi hàm này
      />
    </Container>
  );
}

export default BookManagementPage;

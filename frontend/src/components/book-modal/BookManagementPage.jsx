import React, { useState } from 'react';
import BookFormModal from './BookFormModal';
import { Button, Container } from 'react-bootstrap';
import axios from 'axios';
import AlertBox from '../alert-box/AlertBox'; // Import AlertBox
import ActionButton from '../action-button/ActionButton'; 
function BookManagementPage() {
  const [showModal, setShowModal] = useState(false);
  const [notification, setNotification] = useState(null); // lưu thông báo

  const handleSave = (data) => {
    console.log('Data saved:', data);
   // Gọi API để lưu dữ liệu vào cơ sở dữ liệu
   axios.post('http://localhost/LibManage/api/book-management/add-book.php', data)
      .then(response => {
        if(response.data.success) {
          console.log('Book added successfully:', response);
          setNotification({ message: 'Thêm sách thành công!', type: 'success' });
        }else {
        console.error('Error adding book:', response.data);
        setNotification({ message: 'Lỗi khi thêm sách!', type: 'error' });
        }
      })
      .catch(error => {
        console.error('Error adding book:', error);
      });
   
  };

  return (
    <div>
      {notification && (
        <AlertBox
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    <Container className="mt-4">
       <ActionButton
      onClick={() => setShowModal(true)}
      label="Thêm sách"
      icon={<i className="fa fa-plus"></i>}
      className="add" // đổi màu xanh lá
    />
      <BookFormModal
        show={showModal}
        onSubmit={handleSave}
        hide ={() => setShowModal(false)} // Nếu nhấn nút "X" thì sẽ gọi hàm này
      />
    </Container>
    </div>
  );
}

export default BookManagementPage;

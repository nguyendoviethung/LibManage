import { useState } from 'react';
import BookFormModal from './BookFormModal';
import { Container } from 'react-bootstrap';
import AlertBox from '../alert-box/AlertBox'; 
import ActionButton from '../action-button/ActionButton'; 
import './ActionButtonGroup.scss';

function BookManagementPage() {
  
  const [showModal, setShowModal] = useState(false); // trạng thái hiển thị modal
  const [alertBox, setAlertBox] = useState(null); // lưu thông báo khi submit form(kể cả tìm kiếm lẫn CRUD thực tế)
  const [crudAction, setCrudAction] = useState(''); // lưu hành động CRUD (Create, Read, Update, Delete);

  return (
    <>
      {alertBox && ( // Nếu alertBox không null thì hiển thị
        <AlertBox
          message={alertBox.message}
          type={alertBox.type}
          onClose={() =>  setAlertBox(null)}
        />
      )}
      
    <Container className="mt-4">

  <div className="action-button-group">

    {/* Thêm sách */}
    <ActionButton
      onClick={() => {
        setShowModal(true);
        setCrudAction('add');
      }}
      label="Thêm sách"
      icon={<i className="fa fa-plus"></i>}
      className="add"
    />

    {/* Tìm kiếm sách */}
    <ActionButton
      onClick={() => {
        setCrudAction('search');
        setShowModal(true);
      }}
      label="Tìm sách"
      icon={<i className="fa fa-search"></i>}
      className="search"
    />

    {/* Sửa sách */}
    <ActionButton
      onClick={() => {
        setCrudAction('update');
        setShowModal(true);
      }}
      label="Sửa sách"
      icon={<i className="fa fa-edit"></i>}
      className="edit"
    />

    {/* Xoá sách */}
    <ActionButton
      onClick={() => {
        setCrudAction('delete');
        setShowModal(true);
      }}
      label="Xoá sách"
      icon={<i className="fa fa-trash"></i>}
      className="delete"
    />

   </div>

  {/* Modal */}
    <BookFormModal
      show={showModal}
      hide={() => setShowModal(false)}
      crudAction={crudAction}
      setAlertBox={setAlertBox} 
    />

    </Container>  
    </>
  );
}

export default BookManagementPage;

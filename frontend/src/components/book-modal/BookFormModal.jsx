import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from 'react';
import { addBook, searchBook, updateBook, deleteBook } from './BookService'; // Import các hàm API

function BookFormModal({ show, hide, crudAction,setAlertBox }) {
  const [stateCRUDModal, setStateCRUDModal] = useState(false);

  // Khởi tạo form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    language: '',
    year: '',
    location: '',
    genre: '',
    quantity: '',
    oldTitle: ''
  });

  // Reset form mỗi khi mở modal mới
  useEffect(() => {
    if (show) {
      setFormData({
        title: '',
        author: '',
        language: '',
        year: '',
        location: '',
        genre: '',
        quantity: '',
        oldTitle: ''
      });
      setStateCRUDModal(false); // reset lại flag
    }
  }, [show]);

  // Xử lý thay đổi input khi người dùng nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (
    (crudAction === 'search' || crudAction === 'update' || crudAction === 'delete') &&
    !stateCRUDModal
  ) {
    const result = await searchBook({ bookName: formData.title });
    if (result.success) {
      setFormData(result.data); // prefill data
      setStateCRUDModal(true);
      formData.oldTitle = formData.title; // lưu lại tên sách cũ để cập nhật
    } else {
     setAlertBox({ message: 'Không tìm thấy sách', type: 'error' });
    }
    return;
  }

  let result = null;
  if (crudAction === 'add') result = await addBook(formData);
  else if (crudAction === 'update') result = await updateBook(formData);
  else if (crudAction === 'delete') result = await deleteBook({ bookName: formData.title });

  if (result?.success) { //result?. là để kiểm tra xem result có tồn tại không và nếu có thì mới gọi đến thuộc tính success
    const messages = {
    add: 'Thêm sách thành công!',
    update: 'Cập nhật sách thành công!',
    delete: 'Xóa sách thành công!'
  };
    //Gọi hàm setAlertBox từ cha để hiển thị thông báo
  setAlertBox({ message: messages[crudAction], type: 'success' });
    // Reset form sau khi thực hiện thành công
   setFormData({
        title: '',
        author: '',
        language: '',
        year: '',
        location: '',
        genre: '',
        quantity: '',
        oldTitle: ''
      });
      // Đóng phần nhập liệu( trừ title)
      setStateCRUDModal(false)
  } else {
    alert(result?.message || 'Có lỗi xảy ra!');
  }
};

  // Readonly là cho các trường không phải là add hoặc (update và stateCRUDModal là true)
  const isEditable = (crudAction === 'update' && stateCRUDModal) || crudAction === 'add';

  //Nếu là add hoặc hoặc ( search, update, delete) và stateCRUDModal là true thì hiển thị các trường
  const shouldShowFields =
    crudAction === 'add' || (['search', 'update', 'delete'].includes(crudAction) && stateCRUDModal);

  return (
    <Modal show={show} onHide={hide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          {crudAction === 'add' && 'Thêm sách'}
          {crudAction === 'update' && 'Chỉnh sửa sách'}
          {crudAction === 'search' && 'Tìm kiếm sách'}
          {crudAction === 'delete' && 'Xoá sách'}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBookTitle">
            <Form.Label>Tên sách</Form.Label>
            <Form.Control
              type="text"
              name="title"
              placeholder="Nhập tên sách"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>

          {shouldShowFields && (
            <>
              <Form.Group className="mb-3" controlId="formAuthor">
                <Form.Label>Tác giả</Form.Label>
                <Form.Control
                  type="text"
                  name="author"
                  placeholder="Nhập tên tác giả"
                  value={formData.author}
                  onChange={handleChange}
                  readOnly={!isEditable}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLanguage">
                <Form.Label>Ngôn ngữ</Form.Label>
                <Form.Control
                  type="text"
                  name="language"
                  placeholder="Nhập ngôn ngữ"
                  value={formData.language}
                  onChange={handleChange}
                  readOnly={!isEditable}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formYear">
                <Form.Label>Năm xuất bản</Form.Label>
                <Form.Control
                  type="number"
                  name="year"
                  placeholder="Nhập năm xuất bản"
                  value={formData.year}
                  onChange={handleChange}
                  readOnly={!isEditable}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formLocation">
                <Form.Label>Vị trí</Form.Label>
                <Form.Control
                  type="text"
                  name="location"
                  placeholder="Nhập vị trí sách"
                  value={formData.location}
                  onChange={handleChange} 
                  readOnly={!isEditable}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGenre">
                <Form.Label>Thể loại</Form.Label>
                <Form.Control
                  type="text"
                  name="genre"
                  placeholder="Nhập thể loại"
                  value={formData.genre}
                  onChange={handleChange}
                  readOnly={!isEditable}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formQuantity">
                <Form.Label>Số lượng</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  placeholder="Nhập số lượng"
                  value={formData.quantity}
                  onChange={handleChange}
                  readOnly={!isEditable}
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant={  // Kiểu nút submit dựa trên hành động CRUD
              crudAction === 'add'
                ? 'success'
                : crudAction === 'search'
                ? 'warning'
                : crudAction === 'update'
                ? 'info'
                : crudAction === 'delete'
                ? 'danger'
                : 'secondary'
            }
            type="submit"
          > 
          {/*Tiêu đề dựa trên hành động CRUD */}
            {crudAction === 'add' && 'Thêm sách'}
            {crudAction === 'search' && (stateCRUDModal ? 'Tiếp tục' : 'Tìm kiếm sách')}
            {crudAction === 'update' && (stateCRUDModal ? 'Cập nhật sách' : 'Tìm kiếm sách')}
            {crudAction === 'delete' && (stateCRUDModal ? 'Xoá sách' : 'Tìm kiếm sách')}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default BookFormModal;

  import { useState, useEffect } from 'react';
  import { Modal, Button, Form } from 'react-bootstrap';
  import './Modal.scss';

  function ReaderForm({ show, onHide, actionState, handleUpdate,handleAddReader, readerData}) {

// Bỏ toàn bộ khoảng trắng (đầu/giữa/cuối)
function removeSpaces(str = "") {
  return str.replace(/\s+/g, "");
}

// Chuyển thường + bỏ dấu (xử lý cả Đ/đ)
function toLowerNoAccent(str = "") {
  return str
    .toLowerCase()
    .normalize("NFD")                 // tách dấu
    .replace(/[\u0300-\u036f]/g, "") // xoá dấu
    .replace(/đ/g, "d");             // map đ -> d (Đ đã toLowerCase thành đ)
}

// (Tuỳ chọn) lọc chỉ còn a-z0-9 cho local-part email
function keepAlnum(str = "") {
  return str.replace(/[^a-z0-9]/g, "");
}

// Kết hợp
function formatString(str = "") {
  return keepAlnum(removeSpaces(toLowerNoAccent(str)));
}

    // Dữ liệu hiển thị trong form 
    const [reader, setReader] = useState({  
      student_id: '',
      full_name: '',
      email: '@stu.gcut.edu.vn',
      phone_number: '',
      faculty: '',
      status: '',
      keepAccountStatus: false,
    });
  
      // Sử dụng useEffect để gán readerData khi modal hiện ra
      useEffect(() => {
        if (actionState === 'update-info-reader' && readerData) {
          setReader({
            student_id: readerData.student_id || '',
            full_name: readerData.full_name || '',
            email: readerData.email || '',
            phone_number: readerData.phone_number || '',
            faculty: readerData.faculty || '',
            status: readerData.status || '',
            keepAccountStatus: false,
          });
        
        } else if (actionState === 'add') {
          setReader({
            student_id: '',
            full_name: '',
            email: '@stu.gcut.edu.vn',
            phone_number: '',
            faculty: '',
            status: '',
            keepAccountStatus: false
          });
         
        }
      }, [readerData, actionState]);

    // Xử lý thay đổi input
const handleChange = (e) => {
  const { name, type, value, checked } = e.target;

  setReader(prev => {
    // Giá trị mới của field đang thay đổi
    const updatedValue = type === 'checkbox' ? checked : value;

    // Dữ liệu tạm thời sau khi update field
    const updatedReader = {
      ...prev,
      [name]: updatedValue,
    };

    // cập nhật lại email dựa trên full_name + student_id
      updatedReader.email = 
      formatString(updatedReader.full_name) + 
      formatString(updatedReader.student_id) + 
      "@stu.gcut.edu.vn";

    return updatedReader;
  });
};


    const handleSubmit = (e) => {
    e.preventDefault();
    actionState === 'update-info-reader'
      ? handleUpdate( reader.student_id, reader )
      : handleAddReader(reader);
    }
    return (  
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionState === 'update-info-reader' ? 'Cập nhật' : 'Thêm'} sinh viên
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Mã sinh viên</Form.Label>
              <Form.Control
                type="text"
                name="student_id"
                value={reader.student_id}
                onChange={handleChange}
                placeholder="Nhập mã sinh viên"
                disabled={actionState === 'update-info-reader'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Họ tên</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={reader.full_name}
                onChange={handleChange}
                placeholder="Nhập họ tên"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={reader.email}
                onChange={handleChange}
                
                 disabled = {true}
                placeholder="Nhập email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={reader.phone_number}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngành học</Form.Label>
              <Form.Select
                name="faculty"
                value={reader.faculty}
                onChange={handleChange}
              >
                <option value="">-- Chọn ngành học --</option>
                <option value="Khoa Học Máy Tính">Khoa Học Máy Tính</option>
                <option value="Tự Động Hóa & Điện Tử">Tự Động Hóa & Điện Tử</option>
                <option value="Công Nghệ Thông Tin Toàn Cầu">Công Nghệ Thông Tin Toàn Cầu</option>
                <option value="Kỹ Thuật Phần Mềm">Kỹ Thuật Phần Mềm</option>
                <option value="Quản Trị Công Nghệ">Quản Trị Công Nghệ</option>
                <option value="Thiết Kế & Truyền Thông Số">Thiết Kế & Truyền Thông Số</option>
                <option value="Khoa Học Dữ Liệu & AI">Khoa Học Dữ Liệu & AI</option>
                <option value="Ngoại Ngữ & Giao Tiếp">Ngoại Ngữ & Giao Tiếp</option>
                <option value="Công Nghệ Sinh Học & Kỹ Thuật Y Sinh">Công Nghệ Sinh Học & Kỹ Thuật Y Sinh</option>
              </Form.Select>
            </Form.Group>

            {actionState === 'update-info-reader' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Trạng thái tài khoản</Form.Label>
                  <Form.Select
                    name="status"
                    value={reader.status}
                    onChange={handleChange}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Banned">Banned</option>
                  </Form.Select>
                </Form.Group>
          
            <Form.Group className="mb-3 d-flex align-items-center align-items-start">
          <input
            className="form-checkbox"
            type="checkbox"
            name="keepAccountStatus"
            checked={reader.keepAccountStatus}
            onChange={handleChange}
          />

               <label className="ms-2 form-check-label">
                 Đồng bộ trạng thái tài khoản với người dùng
               </label>
            </Form.Group>

              </>
            )}
          </Modal.Body>

          <Modal.Footer>
            {actionState === 'update-info-reader' ? (
              <Button className = "btn-custom-update-reader" type="submit" >
                Update
              </Button>
            ) : (
              <Button className ="btn-add-reader" type="submit">
                Add Reader
              </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }

  export default ReaderForm;

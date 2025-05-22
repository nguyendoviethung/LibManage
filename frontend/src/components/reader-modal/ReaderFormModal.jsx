import { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function ReaderModal({ show, onHide, actionState, handleUpdate,handleAddReader, initialData, checkAccountReader}) {
  // Dữ liệu hiển thị trong form 
  const [reader, setReader] = useState({  
    student_id: '',
    full_name: '',
    email: '',
    phone_number: '',
    faculty: '',
    status: ''
  });
  // State kiểm tra xem có muốn đồng bộ với tài khoản người dùng hay là không
  const [keepAccountStatus, setKeepAccountStatus] = useState(false);

    // Sử dụng useEffect để gán initialData khi modal hiện ra
    useEffect(() => {
      if (actionState === 'update' && initialData) {
        setReader({
          student_id: initialData.student_id || '',
          full_name: initialData.full_name || '',
          email: initialData.email || '',
          phone_number: initialData.phone_number || '',
          faculty: initialData.faculty || '',
          status: initialData.status || ''
        });
        setKeepAccountStatus(false);
      } else if (actionState === 'add') {
        setReader({
          student_id: '',
          full_name: '',
          email: '',
          phone_number: '',
          faculty: '',
          status: ''
        });
        setKeepAccountStatus(false);
      }
    }, [initialData, actionState]);

   // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setReader((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  actionState === 'update'
    ? handleUpdate({...reader, keepAccountStatus }) //...reader (đang dùng Spread Operator) là các thuộc tính của reader luôn (student_id: "...",full_name: "...",email: "...",...)
    : handleAddReader(reader);
}
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>
          {actionState === 'update' ? 'Cập nhật' : 'Thêm'} sinh viên
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
              disabled={actionState === 'update'}
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

          {actionState === 'update' && (
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
          {checkAccountReader && (
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Đồng bộ trạng thái tài khoản với người dùng"
                  checked={keepAccountStatus}
                  onChange={(e) => setKeepAccountStatus(e.target.checked)}
                />
              </Form.Group> )}
            </>
          )}
        </Modal.Body>

        <Modal.Footer>
          {actionState === 'update' ? (
            <Button variant="primary" type="submit" >
              Cập nhật
            </Button>
          ) : (
            <Button variant="success" type="submit">
              Thêm sinh viên
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default ReaderModal;

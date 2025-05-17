import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { listUser } from '../../api/UserManagementAPI'; // Giả sử đây là hàm gọi API

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);

  // Gọi API lấy danh sách người dùng còn hoạt động
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await listUser();
        const activeUsers = res.filter((user) => user.status === 'active');
        setStudents(activeUsers);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    };

    fetchUsers();
  }, []);

  // Lọc theo tìm kiếm
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.includes(searchTerm)
  );

  return (
    <div className="container mt-4">
      {/* Thanh chức năng */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
        <input
          type="text"
          className="form-control w-100 w-md-25"
          placeholder="🔍 Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="d-flex gap-2">
          <Form.Select className="form-select">
            <option value="">-- Bộ lọc khoa --</option>
            <option value="CNTT">CNTT</option>
            <option value="Kinh tế">Kinh tế</option>
            <option value="Ngôn ngữ">Ngôn ngữ</option>
          </Form.Select>

          <Button variant="success" onClick={() => setShowModal(true)}>
            + Thêm sinh viên
          </Button>
        </div>
      </div>

      {/* Bảng sinh viên */}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Mã SV</th>
              <th>Họ tên</th>
              <th>Khoa</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th className="text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.name}</td>
                  <td>{s.department}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td className="text-center">
                    <Button size="sm" variant="outline-primary" className="me-1">✏️</Button>
                    <Button size="sm" variant="outline-success" className="me-1">👤</Button>
                    <Button size="sm" variant="outline-danger">🗑️</Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  Không có sinh viên nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal thêm sinh viên */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sinh viên</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Họ và tên</Form.Label>
              <Form.Control type="text" placeholder="Nhập họ tên" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Mã số sinh viên</Form.Label>
              <Form.Control type="text" placeholder="Nhập MSSV" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Nhập email" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control type="text" placeholder="Nhập số điện thoại" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Khoa</Form.Label>
              <Form.Select>
                <option>-- Chọn khoa --</option>
                <option value="CNTT">CNTT</option>
                <option value="Kinh tế">Kinh tế</option>
                <option value="Ngôn ngữ">Ngôn ngữ</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Lưu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default UserManagementPage;

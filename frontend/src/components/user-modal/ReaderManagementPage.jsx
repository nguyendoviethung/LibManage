import { useState, useEffect } from 'react';
import {
  listReader,
  createReader,
  updateReader,
  deleteReader,
  searchReader
} from '../../api/ReaderManagementAPI';

import ReaderModal from './ReaderFormModal';
import AddAccountModal from './AddAccountModal';
import NotificationModal from './NotificationModal';
import { Form, Button, Table } from 'react-bootstrap';

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Trạng thái cho thanh tìm kiếm 
  const [students, setStudents] = useState([]); // Trạng thái cho dữ liệu sinh viên 
  const [readerModal, setReaderModal] = useState(false); // Trạng thái hiển thị modal cho sinh viên 
  const [accountModal, setAccountModal] = useState(false);// Trạng thái hiển thị modal cho tài khoản 
  const [notificationModal, setNotificationModal] = useState(false); // Trạng thái hiển thị thông báo muốn thêm tài khoản hay khôn sau khi thêm người đọc 
  const [actionState, setActionState] = useState(''); // Trạng thái cho hành động thực hiện (CRUD)
  const [selectedReader, setSelectedReader] = useState(null);  // Trạng thái dữ liệu sẽ hiển thị ra trong form khi nhấn vào add hoặc update(với add là null với update là data của sinh viên tương ứng)
  const [option,setOption] = useState('Tất cả'); // Trạng thái của bộ lọc
  const [addAccount, setAddAccount] = useState (false); // Trạng thái hiện của modal thêm tài khoản cho sinh viên 

  // Gọi API lấy danh sách sinh viên khi component được mount(lấy toàn bộ sinh viên ra)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await listReader();
        setStudents(res.data); // gán danh sách sinh viên
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    };
    fetchUsers();
  }, []);

   //Xử lí khi bộ lọc thay đổi
   const handleChangeOption = (e) =>{
    const op = e.target.value
    setOption(op)
   }

  // Hàm xử lý khi submit form trong modal
 const handleSubmit = async (formData) => {
  try {
    if (actionState === 'add') {
      console.log('Thêm sinh viên mới:', formData);
      const res = await createReader(formData);
      console.log('Kết quả thêm:', res);

    } else if (actionState === 'update') {
      console.log('Cập nhật sinh viên:', formData);
      const res = await updateReader(formData);
      console.log('Kết quả cập nhật:', res);

    } else if (actionState === 'delete') {
      console.log('Xoá sinh viên:', formData);
      const res = await deleteReader(formData.student_id);
      console.log('Kết quả xóa:', res);
    }
    // setReaderModal(false); // Đóng modal sau thao tác
  } catch (error) {
    console.error('Lỗi khi xử lý sinh viên:', error);
  }
};

const handleSearch = async () => {
  try {
    const res = await searchReader({ searchTerm, option });
    if (res.success) {
      setStudents(res.data);
    } else {
      alert(res.message || "Không tìm thấy sinh viên nào");
    }
  } catch (err) {
    console.error("Lỗi tìm kiếm:", err);
  }
};

  return (
    <div className="container mt-4">
      {/* Thanh tìm kiếm và bộ lọc */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-3 gap-2">
        <input
          type="text"
          className="form-control w-100 w-md-25"
          placeholder="Tìm kiếm theo tên hoặc MSSV"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" onClick={() => {
        setActionState('search') // Hành động tìm kiếm 
        handleSearch({searchTerm : searchTerm,
                      option: option}); // Gọi hàm và truyền giá trị vừa nhập
        }}>Tìm kiếm</Button>

      <div className="d-flex gap-2">
        <Form.Select 
        value = {option}
        onChange={handleChangeOption}
        className="form-select">
          <option value="Tất cả">Tất cả sinh viên</option>
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

          <Button
            variant="success"
            onClick={() => {
              setActionState('search');   // Hành động tìm kiếm 
              setSelectedReader(null);   // Không có dữ liệu trong form
              setReaderModal(true);     // Đặt trạng thái modal là mở
            }}
          >
            Thêm sinh viên
          </Button>
        </div>
      </div>

      {/* BẢNG DANH SÁCH SINH VIÊN */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã sinh viên</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Khoa</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.reader_id}>
              <td>{student.reader_id}</td>
              <td>{student.student_id}</td>
              <td>{student.full_name}</td>
              <td>{student.email}</td>
              <td>{student.phone_number}</td>
              <td>{student.faculty}</td>
              <td className="text-center">
                {/* Nút cập nhật */}
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => {
                    setActionState('update');    // chế độ cập nhật
                    setSelectedReader(student);  // truyền dữ liệu người dùng
                    setReaderModal(true);        // mở modal
                  }}
                >
                  ✏️
                </Button>

                {/* Nút xóa */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => {
                    setActionState('delete');     // chế độ xóa
                    setSelectedReader(student);   // truyền dữ liệu
                    setReaderModal(true);         // mở modal xác nhận hoặc hiển thị dữ liệu
                  }}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm cập nhật xóa */}
      <ReaderModal
        show={readerModal}
        onHide={() => setReaderModal(false)}
        actionState={actionState}
        handleSubmit={handleSubmit}
        initialData={selectedReader}
      />

      {/* CÁC MODAL KHÁC */}
      {/* Hiện thông báo có muốn tiếp tục tạo tài khoản cho sinh viên hay không */}
      {notificationModal && <NotificationModal />}
       {/*Hiện modal để thêm tài khoản cho sinh viên  */}
      {accountModal && (
        <AddAccountModal show={accountModal} onHide={() => setAccountModal(false)} />
      )}
    </div>
  );
};

export default UserManagementPage;

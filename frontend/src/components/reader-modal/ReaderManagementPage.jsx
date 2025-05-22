import { useState, useEffect } from 'react';
import './ReaderManagementPage.scss'
import {
  listReader,
  searchReader,
  checkAccount,
  updateReader,
  addReader,
  addAccount,
  getUserName,
  updateAccountReader,
} from '../../api/ReaderManagementAPI';
import AlertBox from '../alert-box/AlertBox';
import ReaderModal from './ReaderFormModal';
import AddAccountModal from './AddAccountModal';
import AccountNotice from './AccountNotice';
import UpdateAccountModal from './UpdateAccountModal';
import { Form, Button, Table } from 'react-bootstrap';

const UserManagementPage = () => {
  // Trạng thái các input và modals
  const [searchTerm, setSearchTerm] = useState(''); // Giá trị nhập vào từ ô tìm kiếm
  const [students, setStudents] = useState([]); // Danh sách sinh viên
  const [readerModal, setReaderModal] = useState(false); // Modal chỉnh sửa/ thêm sinh viên
  const [addAccountModal, setAddAccountModal] = useState(false); // Modal thêm tài khoản
  const [actionState, setActionState] = useState(''); // Trạng thái hành động: 'add' | 'update'
  const [selectedReader, setSelectedReader] = useState(null); // Dữ liệu sinh viên đang chọn
  const [option, setOption] = useState('Tất cả'); // Lọc theo khoa
  const [accountNotice, setAccountNotice] = useState(null); // Hiện thông báo tạo tài khoản sau khi thêm sinh viên
  const [alertBox, setAlertBox] = useState(null); // Hiện thông báo chung
  const [checkAccountReader, setCheckAccountReader] = useState(null); // Có tài khoản hay chưa (dùng trong modal chỉnh sửa)
  const [lastStudentID, setLastStudentID] = useState(null); // Lưu mã số sinh viên mới thêm để tạo tài khoản
  const [accountStatus, setAccountStatus] = useState({}); // Lưu trạng thái có tài khoản hay không của từng sinh viên
  const [updateAccount, setUpdateAccount] = useState(false); // Modal cập nhật tài khoản
  const [userName, setUserName] = useState(''); // Tên đăng nhập khi cập nhật tài khoản

  // Lấy toàn bộ danh sách sinh viên
  const fetchUsers = async () => {
    try {
      const res = await listReader();
      setStudents(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
    }
  };
 
  // Khi mới vào trang này(component được mount lần đầu tiên) thì thực thi để liệt kê toàn bộ sinh viên ra màn hình
  useEffect(() => {
    fetchUsers();
  }, []);

  // Kiểm tra sinh viên nào có tài khoản
  useEffect(() => {
    const fetchAccountStatuses = async () => {
      const results = await Promise.all(
        students.map(student =>
          checkAccount({ studentID: student.student_id }).then(res => ({
            id: student.student_id,
            status: res.success,
          }))
        )
      );
      const statuses = {};
      results.forEach(({ id, status }) => {
        statuses[id] = status;
      });
      setAccountStatus(statuses);
    };

    if (students.length > 0) fetchAccountStatuses();
  }, [students]);

  // Cập nhật state của bộ lọc khi thay đổi nội dung
  const handleChangeOption = (e) => setOption(e.target.value);

  // Cập nhật thông tin sinh viên
  const handleUpdate = async (formData) => {
    try {
      const res = await updateReader(formData);  
      if (res.success) {
        setAlertBox({ message: res.message, type: "success" });
        setStudents(prev =>
          prev.map(student =>
            student.student_id === formData.student_id ? { ...student, ...formData } : student
          )
        );
      } else {
        setAlertBox({ message: res.message, type: "error" });
      }
    } catch (error) {
      console.error("Lỗi khi xử lý sinh viên:", error);
    }
  };

  // Tìm kiếm sinh viên
  const handleSearch = async () => {
    try {
      const res = await searchReader({ searchTerm, option });
      if (res.success) setStudents(res.data);
      else setAlertBox({ message: res.message, type: "error" });
    } catch (err) {
      console.error("Lỗi tìm kiếm:", err);
    }
  };

  // Thêm sinh viên mới
  const handleAddReader = async (formData) => {
    try {
      const res = await addReader(formData);
      if (res.success) {
        setLastStudentID(formData.student_id);
        setAccountNotice(true);
        setAlertBox({ message: res.message, type: "success" });
        setReaderModal(false);
        fetchUsers();
      } else {
        setAlertBox({ message: res.message, type: "error" });
      }
    } catch (err) {
      console.error("lỗi:", err);
    }
  };

  // Thêm tài khoản mới
  const handleAddAccount = async (formData) => {
    try {
      if (formData.password !== formData.confirmPassword) {
        setAlertBox({ message: "Mật khẩu không khớp!", type: "error" });
        return false;
      }
      const res = await addAccount({
        studentID: lastStudentID,
        username: formData.username,
        password: formData.password
      });
      if (res.success) {
        setAlertBox({ message: res.message, type: "success" });
        fetchUsers();
        return true;
      } else {
        setAlertBox({ message: res.message || "Lỗi không xác định", type: "error" });
        return false;
      }
    } catch (err) {
      console.error("Lỗi:", err);
      setAlertBox({ message: "Có lỗi xảy ra khi tạo tài khoản", type: "error" });
      return false;
    }
  };

  // Cập nhật tài khoản
  const handleUpdateAccount = async (data) => {
    try {
      if (data.password !== data.confirmPassword) {
        setAlertBox({ message: "Mật khẩu xác nhận không khớp", type: "error" });
        return false;
      }
      const res = await updateAccountReader(data);
      if (res.success) {
        setAlertBox({ message: res.message, type: "success" });
        return true;
      } else {
        setAlertBox({ message: res.message, type: "error" });
        return false;
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Đóng modal sinh viên
  const handleCloseModal = () => {
    setReaderModal(false);
    setSelectedReader(null);
    setActionState('');
    setCheckAccountReader(null);
  };

  // Kiểm tra sinh viên có tài khoản không (sử dụng khi mở modal cập nhật)
  const handleCheckAccount = async (studentID) => {
    try {
      const res = await checkAccount({ studentID });
      setCheckAccountReader(res.success);
    } catch (err) {
      console.error(err);
    }
  };

  // Xác nhận tạo tài khoản sau khi thêm sinh viên
  const onConfirm = () => {
    setAddAccountModal(true);
    resetForm();
  };

//Reset lại modal sinh viên 
  const resetForm = () => {
    setReaderModal(false);
    setSelectedReader(null);
    setActionState('');
    setAccountNotice(false);
  };

  // Lấy username để cập nhật tài khoản
  const handleUserName = async (studentID) => {
    try {
      const res = await getUserName({ student_id: studentID });
      setUserName(res.success ? res.data : '');
    } catch (err) {
      console.error(err);
    }
  };

  return (
   <div className="user-management container mt-4">
  {/* Thanh tìm kiếm và bộ lọc */}
  <div className="search-bar-container mb-3">
    <input
      type="text"
      className="form-control search-input"
      placeholder="Tìm kiếm theo tên hoặc MSSV"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <div className="action-buttons">
      <Form.Select value={option} onChange={handleChangeOption} className="form-select">
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

      <Button variant="primary" onClick ={handleSearch}>Tìm kiếm</Button>
      <Button
        variant="success"
        onClick={() => {
          setActionState("add");
          setSelectedReader(null);
          setReaderModal(true);
        }}
      >
        Thêm sinh viên
      </Button>
    </div>
  </div>

  {/* Bảng danh sách sinh viên */}
  <Table striped bordered hover responsive className="custom-table">
    <thead>
      <tr>
        <th className="text-center">STT</th>
        <th className="text-center">Mã sinh viên</th>
        <th className="text-center">Họ tên</th>
        <th className="text-center">Email</th>
        <th className="text-center">SĐT</th>
        <th className="text-center">Khoa</th>
        <th className="text-center">Hành động</th>
      </tr>
    </thead>
    <tbody>
      {students.map((student, index) => (
        <tr key={student.reader_id}>
          <td className="text-center">{index + 1}</td>
          <td className="text-center">{student.student_id}</td>
          <td>{student.full_name}</td>
          <td>{student.email}</td>
          <td className="text-center">{student.phone_number}</td>
          <td>{student.faculty}</td>
          <td className="text-center">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <Button
                variant="warning"
                size="sm"
                onClick={() => {
                  setActionState("update");
                  setSelectedReader(student);
                  handleCheckAccount(student.student_id);
                  setReaderModal(true);
                }}
              >
                ✏️ Sửa thông tin cá nhân
              </Button>

              {accountStatus[student.student_id] === false && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setLastStudentID(student.student_id);
                    setAddAccountModal(true);
                  }}
                >
                  ➕ Tạo tài khoản
                </Button>
              )}

              {accountStatus[student.student_id] === true && (
                <Button
                  variant="info"
                  size="sm"
                  onClick={() => {
                    setLastStudentID(student.student_id);
                    handleUserName(student.student_id);
                    setUpdateAccount(true);
                  }}
                >
                  ⚙️ Sửa tài khoản
                </Button>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>

      {/* Modal các loại */}
        {/* Modal dùng để cập nhật người dùng và thêm người dùng */}
      <ReaderModal show={readerModal} onHide={handleCloseModal} actionState={actionState} handleUpdate={handleUpdate} handleAddReader={handleAddReader} initialData={selectedReader} checkAccountReader={checkAccountReader} />
        {/* Thêm tài khoản mới */}
      {addAccountModal && <AddAccountModal show={addAccountModal} onHide={() => setAddAccountModal(false)} handleAddAccount={handleAddAccount} />}
        {/* Thông báo có muốn tiếp tục cập nhật tài khoản hay là không */}
      {accountNotice && <AccountNotice show={accountNotice} onHide={resetForm} onConfirm={onConfirm} />}
        {/* Modal cập nhật tài khoản */}
      {updateAccount && <UpdateAccountModal show={updateAccount} onHide={() => setUpdateAccount(false)} accountData={userName} handleUpdateAccount={handleUpdateAccount} />}
        {/* Modal thông báo */}
      {alertBox && <AlertBox message={alertBox.message} type={alertBox.type} onClose={() => setAlertBox(null)} />}
    </div>
  );
};

export default UserManagementPage;
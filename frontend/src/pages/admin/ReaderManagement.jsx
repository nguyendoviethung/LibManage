import { useState, useEffect, use } from 'react';
import './ReaderManagement.scss';
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
import AlertBox from '../../components/alert-box/AlertBox';
import ReaderModal from '../../components/reader-modal/ReaderFormModal';
import AddAccountModal from '../../components/reader-modal/AddAccountModal';
import AccountNotice from '../../components/reader-modal/AccountNotice';
import UpdateAccountModal from '../../components/reader-modal/UpdateAccountModal';
import {  Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUserPlus, faFileExport, faRotate, faPenToSquare, faUserEdit,faUserGear, faBuildingColumns } from '@fortawesome/free-solid-svg-icons';
import Search from '../../components/search-bar/Search';
import Filter from '../../components/filter/Filter';
import ActionButton from '../../components/action-button/ActionButton';
function UserManagementPage() {
  // Trạng thái các input và modals
  const [searchTerm, setSearchTerm] = useState(''); // Giá trị nhập vào từ ô tìm kiếm
  const [readers, setReaders] = useState([]); // Danh sách sinh viên
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
  const [currentPage, setCurrentPage] = useState(1);
  const [accountStatusFilter, setAccountStatusFilter] = useState('Tất cả');
  const [faculty, setFaculty] = useState('Tất cả');
  const readersPerPage = 8;
  // Tính toán số trang dựa trên tổng số sinh viên và số sinh viên mỗi trang
  const totalPages = Math.ceil(readers.length / readersPerPage);
  const paginatedReaders = readers.slice(
    (currentPage - 1) * readersPerPage,
    currentPage * readersPerPage
  );

  // Lấy toàn bộ danh sách sinh viên
  const fetchUsers = async () => {
    try {
      const res = await listReader();
      setReaders(res.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách người dùng:', error);
    }
  };
 
  // Khi mới vào trang này(component được mount lần đầu tiên) thì thực thi để liệt kê toàn bộ sinh viên ra màn hình
  useEffect(() => {
    fetchUsers();
  }, []);

  const uniqueAccountStatus = ['Tất cả', ...Array.from(new Set(readers.map(b => b.status).filter(Boolean)))];
  const uniqueFaculty = ['Tất cả', ...Array.from(new Set(readers.map(b => b.faculty).filter(Boolean)))];
  // Kiểm tra sinh viên nào có tài khoản
  useEffect(() => {
    const fetchAccountStatuses = async () => {
      const results = await Promise.all(
        readers.map(student =>
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

    if (readers.length > 0) fetchAccountStatuses();
  }, [readers]);

  // Cập nhật state của bộ lọc khi thay đổi nội dung
  const handleChangeOption = (e) => setOption(e.target.value);

  // Cập nhật thông tin sinh viên
  const handleUpdate = async (formData) => {
    try {
      const res = await updateReader(formData);  
      if (res.success) {
        setAlertBox({ message: res.message, type: "success" });
        setReaders(prev =>
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
      if (res.success) setReaders(res.data);
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
  <>
   <div className="user-management container mt-4">
    {/* Thanh tìm kiếm và bộ lọc */}
  <div className="search-bar-container mb-3">
    <div className="filter-bar">
      <Search
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        placeholder="Tìm kiếm theo tên, mã sinh viên"
      />
      {/* Bộ lọc theo khoa */}
      <Filter
        icon = {faBuildingColumns}
        filterTitle = {"Lọc theo khoa"}
        filterName = {faculty}
        setFilter= {setFaculty}
        uniqueKeyword= {uniqueFaculty}
      />
      {/* Bộ lọc trạng thái tài khoản */}
      <Filter
        icon = {faUserGear}
        filterTitle = {"Lọc theo trạng thái tài khoản"}
        filterName = {accountStatus}
        setFilter= {setFaculty}
        uniqueKeyword= {uniqueAccountStatus}
      />
    </div>
    <div className="toolbar-actions">
        <ActionButton
          onClick={handleSearch}
          label="Tìm kiếm"
          icon={faSearch}
          className="btn-custom-search"
        />
        <ActionButton
          onClick={() => {
            setActionState("export");
            setSelectedReader(null);
            setReaderModal(true);
          }}
          label="Xuất file"
          icon={faFileExport}
          className="btn-custom-export"
        />
        <ActionButton
          onClick={fetchUsers}
          label="Làm mới"
          icon={faRotate}
          className="btn-custom-refresh"
        />
        <ActionButton
          onClick={() => {
            setActionState("add");
            setSelectedReader(null);
            setReaderModal(true);
          }}
          label="Thêm sinh viên"
          icon={faUserPlus}
          className="btn-custom-add-reader"
        />
      </div>
    </div>
     {/* Bảng danh sách sinh viên */}
  <div className="table-scroll-wrapper">
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
      {paginatedReaders.map((student, index) => (
        <tr key={student.reader_id}>
          <td className="text-center">{index + 1}</td>
          <td className="text-center">{student.student_id}</td>
          <td>{student.full_name}</td>
          <td>{student.email}</td>
          <td className="text-center">{student.phone_number}</td>
          <td>{student.faculty}</td>
          <td className="text-center">
            <div className="d-flex flex-wrap justify-content-center gap-2">
              <ActionButton
                onClick={() => {
                  setActionState("update");
                  setSelectedReader(student);
                  handleCheckAccount(student.student_id);
                  setReaderModal(true);
                }}
                icon = {faPenToSquare} 
                className = "btn-custom-edit-personal-information"
                label = "Sửa thông tin"
              >
              </ActionButton>

              {accountStatus[student.student_id] === false && (
                <ActionButton
                  className="btn-custom-add-account"
                  onClick={() => {
                    setLastStudentID(student.student_id);
                    setAddAccountModal(true);
                  }}
                  icon={faUserPlus}
                  label={"Thêm tài khoản"}
                >
                </ActionButton>
              )}

              {accountStatus[student.student_id] === true && (
                <ActionButton
                  onClick={() => {
                    setLastStudentID(student.student_id);
                    handleUserName(student.student_id);
                    setUpdateAccount(true);
                  }}
                  icon={faUserEdit}
                  label = "Cập nhật tài khoản"
                  className={"btn-custom-edit-account-information"}
                >
                </ActionButton>
              )}
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>
{totalPages > 1 && (
  <div className="pagination-wrapper d-flex justify-content-center align-items-center mt-3">
    <Button
      variant="outline-primary"
      size="sm"
      className="mx-1"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      &lt;
    </Button>
    {Array.from({ length: totalPages }, (_, i) => (
      <Button
        key={i + 1}
        variant={currentPage === i + 1 ? "primary" : "outline-primary"}
        size="sm"
        className="mx-1"
        onClick={() => setCurrentPage(i + 1)}
      >
        {i + 1}
      </Button>
    ))}
    <Button
      variant="outline-primary"
      size="sm"
      className="mx-1"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      &gt;
    </Button>
  </div>
)}
  </div>
 
 
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
   
 </>
  );
}

export default UserManagementPage; 
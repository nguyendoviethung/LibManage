import { useState, useEffect } from 'react';
import {
  listReader,
  searchReader,
  checkAccount,
  updateReader,
  addReader,
  addAccount,
  getUserName,
} from '../../api/ReaderManagementAPI';
import AlertBox from '../alert-box/AlertBox'
import ReaderModal from './ReaderFormModal';
import AddAccountModal from './AddAccountModal';
import AccountNotice from './AccountNotice';
import { Form, Button, Table } from 'react-bootstrap';
import UpdateAccountModal from './UpdateAccountModal'

const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Trạng thái cho thanh tìm kiếm 
  const [students, setStudents] = useState([]); // Trạng thái cho dữ liệu sinh viên 
  const [readerModal, setReaderModal] = useState(false); // Trạng thái hiển thị modal cho sinh viên 
  const [addAccountModal, setAddAccountModal] = useState(false); //Modal hiện ra để thêm tài khoản 
  const [actionState, setActionState] = useState(''); // Trạng thái cho hành động thực hiện (CRUD)
  const [selectedReader, setSelectedReader] = useState(null);  // Trạng thái dữ liệu sẽ hiển thị ra trong form khi nhấn vào add hoặc update(với add là null với update là data của sinh viên tương ứng)
  const [option,setOption] = useState('Tất cả'); // Trạng thái của bộ lọc
  const [accountNotice, setAccountNotice] = useState (null); // // Trạng thái hiển thị thông báo muốn thêm tài khoản hay khôn sau khi thêm người đọc 
  const [alertBox,setAlertBox] = useState(null); // Hiển thị thông báo 
  const [checkAccountReader, setCheckAccountReader] = useState(null); // Tình trạng sinh viên có tài khoản hay chưa 
  const [lastStudentID, setLastStudentID] = useState(null); // Lưu mã số sinh viên khi thêm sinh viên 
  const [accountStatus, setAccountStatus] = useState({});
  const [updateAccount,setUpdateAccount] = useState(false);
  const [userName,setUserName] = useState('');

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

   // Xử lí khi bộ lọc thay đổi
  const handleChangeOption = (e) =>{
    const op = e.target.value
    setOption(op)
   }

  // Hàm xử lý khi cập nhật sinh viên
 const handleUpdate = async (formData) => {
  try {
    const res = await updateReader(formData);
    if (res.success) {
      setAlertBox({ message: res.message, type: "success" });

     // Cập nhật lại danh sách sinh viên (students) sau khi chỉnh sửa một sinh viên, mà không cần reload trang.
     // Khi dùng callback function trong setState, React sẽ gọi hàm đó với giá trị state hiện tại, và kết quả trả về sẽ là state mới.(prev) => prev.map(student) thì prev chính là giá trị trước update của students 
      setStudents((prev) =>
        prev.map((student) =>
          student.student_id === formData.student_id
            ? {
                ...student,
                full_name: formData.full_name,
                email: formData.email,
                phone_number: formData.phone_number,
                faculty: formData.faculty,
                status: formData.status,
              }
            : student
        )
      );
    } else {
      setAlertBox({ message: res.message, type: "error" });
    }
  } catch (error) {
    console.error("Lỗi khi xử lý sinh viên:", error);
  }
};

//Kiểm tra từng sinh viên xem có tài khoản hay chưa
  useEffect(() => {
    const fetchAccountStatuses = async () => {
    const statuses = {};
    for (let student of students) {
      const res = await checkAccount({ studentID: student.student_id });
      statuses[student.student_id] = res.success; // true: có tài khoản
    }
    setAccountStatus(statuses);
  };

  if (students.length > 0) {
    fetchAccountStatuses();
  }
}, [students]);

// Xử lí khi tìm kiếm
const handleSearch = async () => {
  try {
    const res = await searchReader({ searchTerm, option });
    if (res.success) {
      setStudents(res.data);
    } else {
      setAlertBox({message:res.message , type : "error"})
    }
  } catch (err) {
    console.error("Lỗi tìm kiếm:", err);
  }
};

//Hàm xử lí khi thêm sinh viên 
const handleAddReader = async (formData)=>{
  try{
    const res = await addReader(formData);
    if(res.success){
      setLastStudentID(formData.student_id); // lưu lại ID để dùng sau
      console.log(res.message)
      setAccountNotice(true);
      setAlertBox({ message: res.message, type: "success" });
      setReaderModal(false);
    }else{
      console.log(res.message)
      setAlertBox({message: res.message, type: "error" });
    }
  }catch (err){
    console.error("lỗi:",err);
  }
}

// Hàm xử lí khi thêm tài khoản cho sinh viên 
const handleAddAccount = async(formData) => {
  try {
    if(formData.password !== formData.confirmPassword){
      setAlertBox({ message: "Mật khẩu không khớp!", type: "error" });
      return false; // Không thành công
    }

    const data = {
      studentID: lastStudentID,
      username: formData.username,
      password: formData.password
    };

    const res = await addAccount(data);

    if (res.success) {
      setAlertBox({ message: res.message, type: "success" });
      return true; // Thành công
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

//Xử lí khi đóng modal 
const handleCloseModal = () => {
  setReaderModal(false);
  setSelectedReader(null); // reset dữ liệu cho lần mở tiếp theo
  setActionState('');       // nếu cần
  setCheckAccountReader(null);
};

// Kiểm tra xem sinh viên có tài khoản hay chưa để hiện checkbox thực hiện đồng bộ 
const handleCheckAccount = async (studentID) => {
  try {
    const res = await checkAccount({ studentID });
    setCheckAccountReader(res.success);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
};

//Xác nhận tiếp tục tạo tài khoản 
const onConfirm = () => {
  setAddAccountModal(true);  // hiện modal thêm tài khoản
  resetForm();               // đóng form + thông báo
};

//Nếu không muốn tiếp tục thêm tài khoản 
const resetForm = () => {
  setReaderModal(false);       // ẩn modal form sinh viên
  setSelectedReader(null);     // xóa dữ liệu cũ
  setActionState('');
  setAccountNotice(false);     // ẩn thông báo
};

//Lấy username của người dùng đã có tài khoản 
const handleUserName = async (studentID) => {
  try {
    const res = await getUserName({ student_id: studentID }); // gửi đúng định dạng object nếu PHP nhận từ JSON
    if (res.success) {
      setUserName(res.data);
    } else {
      setUserName('');
    }
  } catch (err) {
    console.error(err);
  }
};

//Xử lí khi chỉnh sửa tài khoản
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
        setActionState('search')  // Hành động tìm kiếm 
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
              setActionState('add');      // Hành động thêm sinh viên 
              setSelectedReader(null);   // Không có dữ liệu trong form
              setReaderModal(true);     // Đặt trạng thái modal là mở
            }}
          >
            Thêm sinh viên
          </Button>
        </div>
      </div>

      {/* Bảng danh sách sinh viên*/}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>STT</th>
            <th>Mã sinh viên</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>SĐT</th>
            <th>Khoa</th>
            <th className="text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student,index) => (
            <tr key={student.reader_id}>
               <td>{index + 1}</td>
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
                    setSelectedReader(student);  
                    handleCheckAccount(student.student_id);  // Kiểm tra xem người này có tài khoản hay chưa
                    setReaderModal(true);        // mở modal
                  }}
                >
                  ✏️ Sửa thông tin cá nhân
                </Button>

        {accountStatus[student.student_id] === false && (
          <Button
              variant="primary"
              size="sm"
              onClick={() => {
              setLastStudentID(student.student_id); // truyền ID để tạo tài khoản
              setAddAccountModal(true); // mở modal tạo tài khoản
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
              handleUserName(student.student_id)
              setUpdateAccount(true)
            }}
          >
            ⚙️ Sửa tài khoản
          </Button>
        )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal thêm cập nhật xóa */}
      <ReaderModal
        show={readerModal}
        onHide={handleCloseModal}
        actionState={actionState}
        handleUpdate={handleUpdate}
        handleAddReader = {handleAddReader}
        initialData={selectedReader}
        checkAccountReader = {checkAccountReader}
      />

      {/* Modal thêm tài khoản cho sinh viên */}
      {addAccountModal && (
        <AddAccountModal
        show={addAccountModal}
        onHide={() => setAddAccountModal(false)}
        handleAddAccount = {handleAddAccount}
        />
      )}

      {/* Hiện thông báo có muốn tiếp tục tạo tài khoản cho sinh viên hay không */}
      {accountNotice && (
      <AccountNotice
      show={accountNotice}
      onHide={resetForm}    // ấn X hoặc nút "Không"
      onConfirm={onConfirm} // ấn "Có"
      />
)}
    
    {/* Modal tạo tài khoản cho sinh viên */}
    {updateAccount && (
     <UpdateAccountModal show = {updateAccount}
                        onHide = {()=>{setUpdateAccount(false)}}  
                        accountData={userName}  
    />
    )}

    {/* Hiện thông báo ra màn hình */}
      {alertBox && (<AlertBox message = {alertBox.message}  
                              type = {alertBox.type} 
                              onClose = {()=>{setAlertBox(false)}} />
                              )}
    </div>
  );
};

export default UserManagementPage;
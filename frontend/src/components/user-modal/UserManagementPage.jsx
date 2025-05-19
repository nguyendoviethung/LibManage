import  { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { listUser } from '../../api/UserManagementAPI'; // Giả sử đây là hàm gọi API
import ActionButton from '../action-button/ActionButton'
import ReaderModal from './UserFormModal'
const UserManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [userModal,setUserModal] = useState(false);
  const [accountModal,setAccountModal] = useState(false);
  const [actionState,setActionState] =useState('');
  // Gọi API lấy danh sách người dùng còn hoạt động
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res= await listUser();
        setStudents(res.data);
        console.log(students.data)
      } catch (error) {
        console.error('Lỗi khi lấy danh sách người dùng:', error);
      }
    };

    fetchUsers();
  }, []);

  // Lọc theo tìm kiếm


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

          <Button variant="success" onClick={() =>{ setShowModal(true);setActionState('search')}}>
            + Thêm sinh viên
          </Button>
        </div>
      </div>

      <tbody>

        {/* Tất cả học sinh được lấy từ database */}
   {students.map((s) => (
    <tr key={s.reader_id}>
      <td>{s.reader_id}</td>
      <td>{s.student_id}</td>
      <td>{s.full_name}</td>
      <td>{s.email}</td>
      <td>{s.phone_number}</td>
      <td>{s.faculty}</td>
      <td className="text-center">

       <button onClick={() => {
        setUserModal(true);
        setActionState('update');
      }}>✏️</button>

        <button onClick={() => {
          setUserModal(true);
          setActionState('delete');
        }}>🗑️</button>
      </td>
    </tr>
         ))}
      </tbody> 
   
   {userModal && <ReaderModal show ={()=>setStudents(true)} actionState ={actionState}/>}
   {accountModal && <AccountModal show =  />}
   </div>
  );
};

export default UserManagementPage;

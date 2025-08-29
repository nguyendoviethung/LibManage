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


const handleSubmit = async (e) => {
  e.preventDefault();

  const trimmedReader = {
    ...reader,
    student_id: reader.student_id.trim(),
    full_name: reader.full_name.trim(),
    phone_number: reader.phone_number.trim(),
    faculty: reader.faculty.trim(),
  };

  if (actionState === 'update-info-reader') {
    await handleUpdate(trimmedReader.student_id, trimmedReader);
  } else {
    await handleAddReader(trimmedReader);
    // reset form sau khi thêm thành công
    setReader({
      student_id: '',
      full_name: '',
      email: '@stu.gcut.edu.vn',
      phone_number: '',
      faculty: '',
      status: '',
      keepAccountStatus: false,
    });
  }
};



    return (  
      <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionState === 'update-info-reader' ? 'Update' : 'Add'} student
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                name="student_id"
                value={reader.student_id}
                onChange={handleChange}
                placeholder="Enter student code"
                disabled={actionState === 'update-info-reader'}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="full_name"
                value={reader.full_name}
                onChange={handleChange}
                placeholder="Enter full name"
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
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={reader.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Faculty</Form.Label>
              <Form.Select
                name="faculty"
                value={reader.faculty}
                onChange={handleChange}
              >
                <option value="">-- Select faculty --</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Automation & Electronics">Automation & Electronics</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Automotive Engineering">Automotive Engineering</option>
                <option value="Digital Media & Design">Digital Media & Design</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Language & Communication">Language & Communication</option>
                <option value="Biotechnology & Biomedical Engineering">Biotechnology & Biomedical Engineering</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
              </Form.Select>
            </Form.Group>

            {actionState === 'update-info-reader' && (
              <>
                <Form.Group className="mb-3">
                  <Form.Label>Account Status</Form.Label>
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
                Sync account status with reader status
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

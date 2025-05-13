import axios from 'axios';

const BASE_URL = 'http://localhost/LibManage/backend/api/book-lending-and-returning-management';

export const checkStudentId = (data) => axios.post(`${BASE_URL}/check-student.php`, data).then(res => res.data); //Kiểm tra sinh viên có hợp lệ hay không
export const bookLendingProcess = (data) => axios.post(`${BASE_URL}/book-lending-process.php`, data).then(res => res.data);  //Xử lý mượn sách
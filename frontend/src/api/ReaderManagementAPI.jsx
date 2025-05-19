import axios from 'axios';

// Đường dẫn gốc
const BASE_URL = 'http://localhost/LibManage/backend/api/reader-management';

// Các hàm gọi API
// Liệt kê toàn bộ sinh viên ra màn hình khi màn hình khi lần đầu được mount
export const listReader = () =>
  axios.post(`${BASE_URL}/list-reader.php`).then(res => res.data);

//Tìm kiếm sinh viên theo option
export const searchReader = (data) =>
  axios.post(`${BASE_URL}/search-reader.php`, data).then(res => res.data);

//Thêm mới sinh viên 
export const createReader = (data) =>
  axios.post(`${BASE_URL}/create.php`, data).then(res => res.data);

//Cập nhật sinh viên 
export const updateReader = (data) =>
  axios.put(`${BASE_URL}/update.php`, data).then(res => res.data);

//Xóa sinh viên 
export const deleteReader = (student_id) =>
  axios.delete(`${BASE_URL}/delete.php`, { data: { student_id } }).then(res => res.data);


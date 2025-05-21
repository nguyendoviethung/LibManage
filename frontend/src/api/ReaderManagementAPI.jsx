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

export const checkAccount =(data) =>
   axios.post(`${BASE_URL}/check-account.php`, data).then(res => res.data);

export const updateReader = (data) =>
   axios.post(`${BASE_URL}/update-reader.php`, data).then(res => res.data);

export const addReader = (data) =>
   axios.post(`${BASE_URL}/add-reader.php`, data).then(res => res.data);
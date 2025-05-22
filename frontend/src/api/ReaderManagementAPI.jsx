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

//Kiểm tra sinh viên đã có tài khoản thư viện hay chưa
export const checkAccount =(data) =>
   axios.post(`${BASE_URL}/check-account.php`, data).then(res => res.data);

//Cập nhật sinh viên
export const updateReader = (data) =>
   axios.post(`${BASE_URL}/update-reader.php`, data).then(res => res.data);

//Thêm sinh viên
export const addReader = (data) =>
   axios.post(`${BASE_URL}/add-reader.php`, data).then(res => res.data);

//Thêm tài khoản 
export const addAccount = (data) =>
   axios.post(`${BASE_URL}/add-account-reader.php`, data).then(res => res.data);

//Lấy username của người dùng để bỏ vào input trong modal
export const getUserName = (data) =>
   axios.post(`${BASE_URL}/get-user-name.php`, data).then(res => res.data);

//Cập nhật tài khoản người dùng
export const updateAccountReader = (data) =>
   axios.post(`${BASE_URL}/update-account.php`, data).then(res => res.data);
import axios from 'axios';

// Đường dẫn gốc
const BASE_URL = 'http://localhost/LibManage/backend/api/reader-management';

// 1. Lấy danh sách độc giả (GET, có query params)
export const listReader = (params, token) =>
  axios.get(`${BASE_URL}/list-reader.php`, {
    params, // { page, limit, search, ... }
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 2. Tìm kiếm độc giả (GET với query params)
export const searchReader = (params, token) =>
  axios.get(`${BASE_URL}/search-reader.php`, {
    params, // { name, status, ... }
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 3. Kiểm tra độc giả đã có tài khoản thư viện chưa (GET)
export const checkAccount = (params, token) =>
  axios.get(`${BASE_URL}/check-account.php`, {
    params, // { reader_id }
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 4. Cập nhật thông tin độc giả (PUT)
export const updateReader = (id, data, token) =>
  axios.put(`${BASE_URL}/update-reader.php/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 5. Thêm độc giả mới (POST)
export const addReader = (data, token) =>
  axios.post(`${BASE_URL}/add-reader.php`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 6. Thêm tài khoản cho độc giả (POST)
export const addAccount = (data, token) =>
  axios.post(`${BASE_URL}/add-account-reader.php`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 7. Lấy username của độc giả (GET)
export const getUserName = (params, token) =>
  axios.get(`${BASE_URL}/get-user-name.php`, {
    params, // { reader_id }
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 8. Cập nhật tài khoản độc giả (PUT)
export const updateAccountReader = (id, data, token) =>
  axios.put(`${BASE_URL}/update-account.php/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

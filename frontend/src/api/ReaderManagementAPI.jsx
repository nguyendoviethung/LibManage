import httpClient from '../shared/services/httpClient';

// Đường dẫn gốc
const BASE_URL = '/reader-management';

// 1. Lấy danh sách độc giả (GET, có query params)
export const listReader = (params, token) =>
  httpClient.get(`${BASE_URL}/list-reader.php`, {
    params,
  }).then(res => res.data);

// 2. Tìm kiếm độc giả (GET với query params)
export const searchReader = (params, token) =>
  httpClient.get(`${BASE_URL}/search-reader.php`, {
    params,
  }).then(res => res.data);

// 3. Kiểm tra độc giả đã có tài khoản thư viện chưa (GET)
export const checkAccount = (params, token) =>
  httpClient.get(`${BASE_URL}/check-account.php`, {
    params,
  }).then(res => res.data);

// 4. Cập nhật thông tin độc giả (PUT)
export const updateReader = (id, data, token) =>
  httpClient.put(`${BASE_URL}/update-reader.php/${id}`, data).then(res => res.data);

// 5. Thêm độc giả mới (POST)
export const addReader = (data, token) =>
  httpClient.post(`${BASE_URL}/add-reader.php`, data).then(res => res.data);

// 6. Thêm tài khoản cho độc giả (POST)
export const addAccount = (data, token) =>
  httpClient.post(`${BASE_URL}/add-account-reader.php`, data).then(res => res.data);

// 7. Lấy username của độc giả (GET)
export const getUserName = (params, token) =>
  httpClient.get(`${BASE_URL}/get-user-name.php`, {
    params,
  }).then(res => res.data);

// 8. Cập nhật tài khoản độc giả (PUT)
export const updateAccountReader = (id, data, token) =>
  httpClient.put(`${BASE_URL}/update-account.php/${id}`, data).then(res => res.data);

import httpClient from "../shared/services/httpClient";

// Base URL
const BASE_URL = "/book-lending-and-returning-management";

// 1. Kiểm tra sinh viên (GET, có query params nếu cần)
export const checkStudent = (studentId, params, token) =>
  httpClient.get(`${BASE_URL}/check-student.php/${studentId}`, {
    params,
  }).then(res => res.data);

// 2. Mượn sách (POST)
export const borrowBooks = (data, token) =>
  httpClient.post(`${BASE_URL}/book-lending-process.php`, data).then(res => res.data);

// 3. Lấy sách đã mượn theo studentId (GET, có query params)
export const getBorrowedBooks = (studentId, params, token) =>
  httpClient.get(`${BASE_URL}/borrowed-books.php/${studentId}`, {
    params,
  }).then(res => res.data);

// 4. Trả sách (PUT)
export const returnBooks = ( data, token) =>
  httpClient.put(`${BASE_URL}/return-books.php`, data).then(res => res.data);

  // 5. Lấy danh sách các bản ghi 
  export const listBorrowReturn = (params, token) =>
  httpClient.get(`${BASE_URL}/list-borrow-return.php`, {
    params,
  }).then(res => res.data);
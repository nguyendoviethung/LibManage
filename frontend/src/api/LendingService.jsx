import axios from "axios";

// Base URL
const BASE_URL = "http://localhost/LibManage/backend/api/book-lending-and-returning-management";

// 1. Kiểm tra sinh viên (GET, có query params nếu cần)
export const checkStudent = (studentId, params, token) =>
  axios.get(`${BASE_URL}/check-student.php/${studentId}`, {
    params,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 2. Mượn sách (POST)
export const borrowBooks = (data, token) =>
  axios.post(`${BASE_URL}/book-lending-process.php`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 3. Lấy sách đã mượn theo studentId (GET, có query params)
export const getBorrowedBooks = (studentId, params, token) =>
  axios.get(`${BASE_URL}/borrowed-books.php/${studentId}`, {
    params, 
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 4. Trả sách (PUT)
export const returnBooks = ( data, token) =>
  axios.put(`${BASE_URL}/return-books.php`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

  // 5. Lấy danh sách các bản ghi 
  export const listBorrowReturn = (params, token) =>
  axios.get(`${BASE_URL}/list-borrow-return.php`, {
    params, // { page, limit, search, status, studentId, startDate, endDate, ... }
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);
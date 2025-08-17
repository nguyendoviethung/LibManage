import axios from 'axios';

// Base URL
const BASE_URL = 'http://localhost/LibManage/backend/api/book-management';

// 1. Lấy danh sách sách (GET, có query params)
export const listBook = (params, token) =>
  axios.get(`${BASE_URL}/list-book.php`, {
    params, // { page, limit, search, ... }
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 2. Thêm sách mới (POST)
export const addBook = (data, token) =>
  axios.post(`${BASE_URL}/add-book.php`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 3. Cập nhật sách (PUT hoặc PATCH)
export const updateBook = (id, data, token) =>
  axios.put(`${BASE_URL}/update-book.php/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then(res => res.data);

// 4. Xóa sách (DELETE)
export const deleteBook = (id, token) =>
  axios.delete(`${BASE_URL}/delete-book.php`, {
    headers: { Authorization: `Bearer ${token}` },
    data: { book_id: id },  
  }).then(res => res.data);

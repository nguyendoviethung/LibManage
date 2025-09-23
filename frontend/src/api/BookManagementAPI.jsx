import httpClient from '../shared/services/httpClient';

// Base URL
const BASE_URL = '/book-management';

// 1. Lấy danh sách sách (GET, có query params)
export const listBook = (params, token) =>
  httpClient.get(`${BASE_URL}/list-book.php`, {
    params,
  }).then(res => res.data);

// 2. Thêm sách mới (POST)
export const addBook = (data, token) =>
  httpClient.post(`${BASE_URL}/add-book.php`, data).then(res => res.data);

// 3. Cập nhật sách (PUT hoặc PATCH)
export const updateBook = (id, data, token) =>
  httpClient.put(`${BASE_URL}/update-book.php/${id}`, data).then(res => res.data);

// 4. Xóa sách (DELETE)
export const deleteBook = (id, token) =>
  httpClient.delete(`${BASE_URL}/delete-book.php`, {
    data: { book_id: id },
  }).then(res => res.data);

import axios from 'axios';

//Đường dẫn đến API
const BASE_URL = 'http://localhost/LibManage/backend/api/book-management';

export const listBook = () => axios.post(`${BASE_URL}/list-book.php`).then(res => res.data);
export const addBook = (data) => axios.post(`${BASE_URL}/add-book.php`, data).then(res => res.data);
export const deleteBook = (data) => axios.post(`${BASE_URL}/delete-book.php`, data).then(res => res.data);
export const searchBook = (data) => axios.post(`${BASE_URL}/search-book.php`, data).then(res => res.data);
export const updateBook = (data) => axios.post(`${BASE_URL}/update-book.php`, data).then(res => res.data);

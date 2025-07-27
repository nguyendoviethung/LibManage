import axios from 'axios';

const BASE_URL = 'http://localhost/LibManage/backend/api/admin-dashboard';

export const bookCategoryChart = () => axios.get(`${BASE_URL}/number-of-books-by-genre.php`).then(res => res.data); //Số sách theo thể loại
export const monthlyBookLoan = () => axios.get(`${BASE_URL}/monthly-book-loan.php`).then(res => res.data);  //Số lượng sách mượn theo tháng
export const statsData = () => axios.get(`${BASE_URL}/stats-data.php`).then(res => res.data); // Thống kê thư viện
export const newBooksAdd = () => axios.get(`${BASE_URL}/new-books-added.php`).then(res => res.data); // Số lượng sách theo trạng thái
export const mostBorrowedBooks = () => axios.get(`${BASE_URL}/most-borrowed-books.php`).then(res => res.data); // Sách được mượn nhiều nhất từ trước đến nay
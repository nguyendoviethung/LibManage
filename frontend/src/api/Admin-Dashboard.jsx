import axios from 'axios';

const BASE_URL = 'http://localhost/LibManage/backend/api/admin-dashboard';

     //Số sách theo thể loại
export const bookCategoryChart = (token) => axios.get(`${BASE_URL}/number-of-books-by-genre.php`, 
    {headers: {Authorization: `Bearer ${token}`}})
    .then(res => res.data); 

     //Số lượng sách mượn theo tháng
export const monthlyBookLoan = (token) => axios.get(`${BASE_URL}/monthly-book-loan.php`, 
    {headers: {Authorization: `Bearer ${token}`}})
    .then(res => res.data); 

     // Thống kê thư viện
export const statsData = (token) => axios.get(`${BASE_URL}/stats-data.php`, 
    {headers: {Authorization: `Bearer ${token}`}})
    .then(res => res.data); 
    
     // Số lượng sách theo trạng thái
export const newBooksAdd = (token) => axios.get(`${BASE_URL}/new-books-added.php`,
     {headers: {Authorization: `Bearer ${token}`}})
     .then(res => res.data); 

     // Sách được mượn nhiều nhất từ trước đến nay
export const mostBorrowedBooks = (token) => axios.get(`${BASE_URL}/most-borrowed-books.php`, 
    {headers: {Authorization: `Bearer ${token}`}})
    .then(res => res.data); 
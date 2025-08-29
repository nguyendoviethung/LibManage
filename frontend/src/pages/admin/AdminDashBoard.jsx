import { useState, useEffect } from 'react';
import { 
  faBook, 
  faUsers, 
  faBookOpen, 
  faClock
} from '@fortawesome/free-solid-svg-icons';
import BookCategoryChart from '../../components/chart/BookCategoryChart';
import BorrowChart from '../../components/chart/MonthlyBookLoan';
import {statsData, newBooksAdd, mostBorrowedBooks} from '../../api/Admin-Dashboard';
import './AdminDashboard.scss';
import StatCard from '../../components/stat-card/stat-card'; 

 export default function AdminDashBoard() {

  const token = localStorage.getItem("token");
  // Thông kê sách 
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReaders: 0,
    borrowedBooks: 0,
    overdueBooks: 0
  });
  // Sách mới thêm vào 
  const [newBooks, setNewBooks] = useState([]);
  // Sách được mượn nhiều nhất từ trước đến nay
  const [mostBorrowedBooksData, setMostBorrowedBooksData] = useState([]);

  useEffect(() => {
     const res = async () => {
      try {
        const statsRes = await statsData(token);
        const newBooksRes = await newBooksAdd(token);
        const mostBorrowedBooksRes = await mostBorrowedBooks(token);
    
        setStats(statsRes.data); 
        setNewBooks(newBooksRes.data);
        setMostBorrowedBooksData(mostBorrowedBooksRes.data);
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu dashboard:', error);
      }
    };
    // Gọi hàm fetch dữ liệu
    res(); 
  }, [token]);

  return (
    <div className="admin-dashboard">
      {/* Phần tiêu đề - Thẻ thống kê */}

      <div className="stats-section">
        <div className="stats-grid">
          <StatCard icon = {faBook} value={stats.totalBooks} label="Total number of books" />
          <StatCard icon = {faUsers} value={stats.totalReaders} label="Total readers" />
          <StatCard icon = {faBookOpen} value={stats.borrowedBooks} label="Books on loan" />
          <StatCard icon = {faClock} value={stats.overdueBooks} label="Overdue books" />
        </div>
      </div>

      {/* Phần nội dung chính*/}
      <div className="main-content">
        <div className="charts-section">
          <div className="chart-container">
            <h2>Book statistics by genre</h2>
            <BookCategoryChart token ={token}  />
          </div>
          
          <div className="chart-container">
            <h2>Number of books borrowed per month</h2>
            <BorrowChart token = {token} />
          </div>
        </div>

        <div className="data-section">
          <div className="recent-books">
            <h2>New books added</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Current Quantity</th>
                  </tr>
                </thead>
                <tbody>
                   {Array.isArray(newBooks) && newBooks.map((book,index) => (
                    <tr key={index}>
                      <td>{book.title}</td>
                      <td>{book.author_name}</td>
                      <td>{book.quantity}</td>
                    </tr>
                           ))}
                </tbody>

              </table>
            </div>
          </div>

          <div className="recent-readers">
            <h2>Most borrowed book ever</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Number of loans</th>
                  </tr>
                </thead>
          <tbody>
          {Array.isArray(mostBorrowedBooksData) && mostBorrowedBooksData.map((book,index) => (
          <tr key={index}>
           <td>{book.title}</td>
           <td>{book.author_name}</td>
           <td>{book.times}</td>
          </tr>
            ))}
          </tbody>

              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

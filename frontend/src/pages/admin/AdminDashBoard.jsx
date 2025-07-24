import { useState, useEffect } from 'react';
import { 
  faBook, 
  faUsers, 
  faBookOpen, 
  faClock
} from '@fortawesome/free-solid-svg-icons';
import BookCategoryChart from '../../components/charts/BookCategoryChart';
import BorrowChart from '../../components/charts/MonthlyBookLoan';
import './AdminDashboard.scss';
import StatCard from '../../components/stat-card/stat-card'; 
export default function AdminDashBoard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalReaders: 0,
    borrowedBooks: 0,
    overdueBooks: 0
  });

  const [recentBooks, setRecentBooks] = useState([]);
  const [recentReaders, setRecentReaders] = useState([]);

  useEffect(() => {
    // TODO: Fetch statistics from API
    setStats({
      totalBooks: 1250,
      totalReaders: 450,
      borrowedBooks: 89,
      overdueBooks: 12
    });

    // TODO: Fetch recent books and readers
    setRecentBooks([
      { id: 1, title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', addedDate: '2024-01-15' },
      { id: 2, title: 'Nhà Giả Kim', author: 'Paulo Coelho', addedDate: '2024-01-14' },
      { id: 3, title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu', author: 'Rosie Nguyễn', addedDate: '2024-01-13' }
    ]);

    setRecentReaders([
      { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', joinedDate: '2024-01-15' },
      { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', joinedDate: '2024-01-14' },
      { id: 3, name: 'Lê Văn C', email: 'levanc@email.com', joinedDate: '2024-01-13' }
    ]);
  }, []);

  return (
    <div className="admin-dashboard">
      {/* Phần tiêu đề - Thẻ thống kê */}

      <div className="stats-section">
        <div className="stats-grid">
          <StatCard icon = {faBook} value={stats.totalBooks} label="Tổng số sách" />
          <StatCard icon = {faUsers} value={stats.totalReaders} label="Tổng số độc giả" />
          <StatCard icon = {faBookOpen} value={stats.borrowedBooks} label="Sách đang mượn" />
          <StatCard icon = {faClock} value={stats.overdueBooks} label="Sách quá hạn" />
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        <div className="charts-section">
          <div className="chart-container">
            <h2>Thống kê sách theo thể loại</h2>
            <BookCategoryChart />
          </div>
          
          <div className="chart-container">
            <h2>Lượt mượn sách theo tháng</h2>
            <BorrowChart />
          </div>
        </div>

        <div className="data-section">
          <div className="recent-books">
            <h2>Sách mới thêm</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Ngày thêm</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBooks.map(book => (
                    <tr key={book.id}>
                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{new Date(book.addedDate).toLocaleDateString('vi-VN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="recent-readers">
            <h2>Độc giả mới đăng ký</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Ngày đăng ký</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReaders.map(reader => (
                    <tr key={reader.id}>
                      <td>{reader.name}</td>
                      <td>{reader.email}</td>
                      <td>{new Date(reader.joinedDate).toLocaleDateString('vi-VN')}</td>
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

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBook, 
  faBookOpen, 
  faClock, 
  faHeart,
  faSearch,
  faBookReader,
  faHistory,
  faUserEdit,
  faFilePdf,
  faExclamationTriangle,
  faInfoCircle,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import './DashboardUser.scss';

function DashboardUser() {
  const [userStats, setUserStats] = useState({
    totalBorrowed: 0,
    currentlyBorrowed: 0,
    overdueBooks: 0,
    favoriteGenre: 'Văn học'
  });

  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // TODO: Fetch user statistics from API
    setUserStats({
      totalBorrowed: 25,
      currentlyBorrowed: 3,
      overdueBooks: 1,
      favoriteGenre: 'Văn học'
    });

    // TODO: Fetch user's borrowed books
    setBorrowedBooks([
      {
        id: 1,
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        borrowDate: '2024-01-10',
        dueDate: '2024-02-10',
        isOverdue: false
      },
      {
        id: 2,
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        borrowDate: '2024-01-05',
        dueDate: '2024-02-05',
        isOverdue: true
      },
      {
        id: 3,
        title: 'Tuổi Trẻ Đáng Giá Bao Nhiêu',
        author: 'Rosie Nguyễn',
        borrowDate: '2024-01-15',
        dueDate: '2024-02-15',
        isOverdue: false
      }
    ]);

    // TODO: Fetch notifications
    setNotifications([
      {
        id: 1,
        type: 'warning',
        message: 'Sách "Nhà Giả Kim" đã quá hạn 5 ngày',
        date: '2024-01-20'
      },
      {
        id: 2,
        type: 'info',
        message: 'Sách "Tuổi Trẻ Đáng Giá Bao Nhiêu" sắp hết hạn trong 3 ngày',
        date: '2024-01-18'
      },
      {
        id: 3,
        type: 'success',
        message: 'Đã trả sách "Đắc Nhân Tâm" thành công',
        date: '2024-01-15'
      }
    ]);
  }, []);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning': return <FontAwesomeIcon icon={faExclamationTriangle} />;
      case 'info': return <FontAwesomeIcon icon={faInfoCircle} />;
      case 'success': return <FontAwesomeIcon icon={faCheckCircle} />;
      default: return <FontAwesomeIcon icon={faInfoCircle} />;
    }
  };

  const getNotificationClass = (type) => {
    switch (type) {
      case 'warning': return 'notification-warning';
      case 'info': return 'notification-info';
      case 'success': return 'notification-success';
      default: return 'notification-default';
    }
  };

  return (
    <div className="user-dashboard">
      {/* Header Section - User Statistics */}
      <div className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBook} />
            </div>
            <div className="stat-content">
              <h3>{userStats.totalBorrowed}</h3>
              <p>Tổng sách đã mượn</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
            <div className="stat-content">
              <h3>{userStats.currentlyBorrowed}</h3>
              <p>Sách đang mượn</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-content">
              <h3>{userStats.overdueBooks}</h3>
              <p>Sách quá hạn</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <div className="stat-content">
              <h3>{userStats.favoriteGenre}</h3>
              <p>Thể loại yêu thích</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        {/* Borrowed Books Section */}
        <div className="borrowed-books-section">
          <div className="section-header">
            <h2>Sách đang mượn</h2>
            <button className="export-btn">
              <FontAwesomeIcon icon={faFilePdf} />
              <span>Xuất PDF</span>
            </button>
          </div>
          
          <div className="books-grid">
            {borrowedBooks.map(book => (
              <div key={book.id} className={`book-card ${book.isOverdue ? 'overdue' : ''}`}>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">Tác giả: {book.author}</p>
                  <div className="dates">
                    <p>Ngày mượn: {new Date(book.borrowDate).toLocaleDateString('vi-VN')}</p>
                    <p className={book.isOverdue ? 'overdue-date' : ''}>
                      Hạn trả: {new Date(book.dueDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="book-actions">
                  {book.isOverdue && (
                    <span className="overdue-badge">Quá hạn</span>
                  )}
                  <button className="return-btn">Trả sách</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="notifications-section">
          <h2>Thông báo hệ thống</h2>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div key={notification.id} className={`notification-item ${getNotificationClass(notification.type)}`}>
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <p>{notification.message}</p>
                  <span className="notification-date">
                    {new Date(notification.date).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="quick-actions">
        <h2>Thao tác nhanh</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <span>Tìm kiếm sách</span>
          </button>
          
          <button className="action-btn">
            <span className="action-icon">
              <FontAwesomeIcon icon={faBookReader} />
            </span>
            <span>Mượn sách</span>
          </button>
          
          <button className="action-btn">
            <span className="action-icon">
              <FontAwesomeIcon icon={faHistory} />
            </span>
            <span>Lịch sử mượn</span>
          </button>
          
          <button className="action-btn">
            <span className="action-icon">
              <FontAwesomeIcon icon={faUserEdit} />
            </span>
            <span>Cập nhật thông tin</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardUser;
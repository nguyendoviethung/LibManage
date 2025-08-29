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
      favoriteGenre: 'Literature'
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
        message: 'Book "Nhà Kim Giả" is 5 days overdue.',
        date: '2024-01-20'
      },
      {
        id: 2,
        type: 'info',
        message: 'Book "Tuổi Trẻ Đáng Giá Bao Nhiêu" is expiring in 3 days',
        date: '2024-01-18'
      },
      {
        id: 3,
        type: 'success',
        message: 'Book "Đắc Nhân Tâm" returned successfully',
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
              <p>Total books borrowed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faBookOpen} />
            </div>
            <div className="stat-content">
              <h3>{userStats.currentlyBorrowed}</h3>
              <p>Books on loan</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-content">
              <h3>{userStats.overdueBooks}</h3>
              <p>Overdue books</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <FontAwesomeIcon icon={faHeart} />
            </div>
            <div className="stat-content">
              <h3>{userStats.favoriteGenre}</h3>
              <p>Favorite genre</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="main-content">
        {/* Borrowed Books Section */}
        <div className="borrowed-books-section">
          <div className="section-header">
            <h2>Books on loan</h2>
            <button className="export-btn">
              <FontAwesomeIcon icon={faFilePdf} />
              <span>Export PDF</span>
            </button>
          </div>
          
          <div className="books-grid">
            {borrowedBooks.map(book => (
              <div key={book.id} className={`book-card ${book.isOverdue ? 'overdue' : ''}`}>
                <div className="book-info">
                  <h3>{book.title}</h3>
                  <p className="author">Tác giả: {book.author}</p>
                  <div className="dates">
                    <p>Borrowed date: {new Date(book.borrowDate).toLocaleDateString('vi-VN')}</p>
                    <p className={book.isOverdue ? 'overdue-date' : ''}>
                      Payment date: {new Date(book.dueDate).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
                <div className="book-actions">
                  {book.isOverdue && (
                    <span className="overdue-badge">Overdue</span>
                  )}
                  <button className="return-btn">Return book</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications Section */}
        <div className="notifications-section">
          <h2>System Notifications</h2>
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
        <h2>Quick Action</h2>
        <div className="actions-grid">
          <button className="action-btn">
            <span className="action-icon">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <span>Search for books</span>
          </button>
          
          <button className="action-btn">
            <span className="action-icon">
              <FontAwesomeIcon icon={faBookReader} />
            </span>
            <span>Borrow books</span>
          </button>
          
          <button className="action-btn">
            <span className="action-icon">
              <FontAwesomeIcon icon={faHistory} />
            </span>
            <span>Borrowing history</span>
          </button>
          
          <button className="action-btn">
            <span className="action-icon">
              <FontAwesomeIcon icon={faUserEdit} />
            </span>
            <span>Update information</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardUser;

import "./DashboardUser.scss";

function BookSearch() {
  return (
    <>
  
      <div className="user-dashboard">
        <div className="main-content">
          <div className="borrowed-books-section">
            <div className="section-header">
              <h2>Tìm kiếm sách</h2>
              <div style={{ flex: 1 }} />
            </div>
            <div className="books-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="book-card">
                  <div className="book-info">
                    <h3>Tựa sách {i}</h3>
                    <p className="author">Tác giả: Tên tác giả</p>
                    <div className="dates">
                      <p>Năm xuất bản: 2023</p>
                      <p>Mô tả ngắn: Lorem ipsum dolor sit amet...</p>
                    </div>
                  </div>
                  <div className="book-actions">
                    <button className="return-btn">Xem chi tiết</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BookSearch;
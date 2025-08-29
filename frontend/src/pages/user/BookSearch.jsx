
import "./DashboardUser.scss";

function BookSearch() {
  return (
    <>
      <div className="user-dashboard">
        <div className="main-content">
          <div className="borrowed-books-section">
            <div className="section-header">
              <h2>Search for books</h2>
              <div style={{ flex: 1 }} />
            </div>
            <div className="books-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="book-card">
                  <div className="book-info">
                    <h3>Title{i}</h3>
                    <p className="author">Author: Author Name</p>
                    <div className="dates">
                      <p>Publication Year: 2023</p>
                      <p>Short description: Lorem ipsum dolor sit amet...</p>
                    </div>
                  </div>
                  <div className="book-actions">
                    <button className="return-btn">See details</button>
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
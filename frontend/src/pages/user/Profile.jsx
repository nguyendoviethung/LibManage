
import "./DashboardUser.scss";

function Profile() {
  return (
    <>
      
      <div className="user-dashboard">
        <div className="main-content">
          <div className="borrowed-books-section">
            <div className="section-header">
              <h2>Thông tin cá nhân</h2>
            </div>
            <div className="books-grid">
              <div className="book-card" style={{ gridColumn: "1 / -1" }}>
                <div className="book-info">
                  <h3>Ảnh đại diện</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e5e7eb" }} />
                    <button className="return-btn">Tải ảnh lên</button>
                  </div>
                </div>
              </div>

              {[
                { label: "Họ và tên", placeholder: "Nguyễn Văn A" },
                { label: "MSSV", placeholder: "B2012345" },
                { label: "Email", placeholder: "sinhvien@abc.edu.vn" },
                { label: "Số điện thoại", placeholder: "09xx xxx xxx" },
              ].map((f, i) => (
                <div key={i} className="book-card">
                  <div className="book-info">
                    <h3>{f.label}</h3>
                    <input style={{ width: "100%", padding: 10, border: "1px solid #ddd", borderRadius: 8 }} placeholder={f.placeholder} />
                  </div>
                </div>
              ))}

              <div className="book-card" style={{ gridColumn: "1 / -1" }}>
                <div className="book-info">
                  <h3>Đổi mật khẩu</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <input type="password" placeholder="Mật khẩu hiện tại" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
                    <input type="password" placeholder="Mật khẩu mới" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
                    <input type="password" placeholder="Nhập lại mật khẩu mới" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <button className="return-btn">Cập nhật</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
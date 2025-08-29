
import "./DashboardUser.scss";

function Profile() {
  return (
    <>
      <div className="user-dashboard">
        <div className="main-content">
          <div className="borrowed-books-section">
            <div className="section-header">
              <h2>Profile</h2>
            </div>
            <div className="books-grid">
              <div className="book-card" style={{ gridColumn: "1 / -1" }}>
                <div className="book-info">
                  <h3>Avatar</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#e5e7eb" }} />
                    <button className="return-btn">Upload photo</button>
                  </div>
                </div>
              </div>

              {[
                { label: "Full Name", placeholder: "Lionel Messi" },
                { label: "Student ID", placeholder: "20xxxxxx" },
                { label: "Email", placeholder: "sinhvien@gnguyenvanan20204567@stu.gcut.edu.vn" },
                { label: "Phone Number", placeholder: "09xx xxx xxx" },
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
                  <h3>Change password</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
                    <input type="password" placeholder="Current Password" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
                    <input type="password" placeholder="New Password" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
                    <input type="password" placeholder="Re-enter new password" style={{ padding: 10, border: "1px solid #ddd", borderRadius: 8 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <button className="return-btn">Update</button>
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
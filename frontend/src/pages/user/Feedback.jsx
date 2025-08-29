import Navbar from "../../components/navbar/Navbar";
import "./DashboardUser.scss";

function Feedback() {
  return (
    <>

      <div className="user-dashboard">
        <div className="main-content">
          <div className="notifications-section">
            <h2>System Feedback</h2>
            <div className="notifications-list" style={{ gap: 16 }}>
              <div className="notification-item notification-info" style={{ width: "100%" }}>
                <div className="notification-content" style={{ width: "100%" }}>
                  <p>Content</p>
                  <textarea style={{ width: "100%", minHeight: 140 }} placeholder="Nhập góp ý của bạn..." />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <button className="return-btn">Send</button>
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

export default Feedback;
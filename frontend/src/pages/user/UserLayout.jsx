// src/layouts/AdminLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarUser } from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect } from "react";
import axios from "axios";

const UserLayout = () => {
  const navigate = useNavigate(); // Dùng để điều hướng trang sau khi sử lí xong một logic
  // Nếu chưa login thì không được phép vào trang này , tự động về trang login (khi logout click Back ở trình duyệt cũng không thể vào lại trang này nữa)
  useEffect(() => {
    
    const checkAuth = async () => {
      try {
        await axios.get("http://localhost/LibManage/backend/api//auth/check-session.php", { // Kiểm tra xem người dùng đã đăng nhập vào hay chưa , tránh chưa đăng nhập vào thẳng trang web
          withCredentials: true,
        });
      } catch (err) {  
        console.warn("Chưa đăng nhập hoặc session hết hạn");
        navigate("/"); // về login
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />
      <div style={{ display: "flex" }}>
        <SidebarUser />
        <main style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default UserLayout ;

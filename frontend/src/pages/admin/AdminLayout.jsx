// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import {SidebarAdmin} from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
const AdminLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
        {/* Những component được sử dụng ở đây là những thành phần chung giữa các trang  */}
      <Navbar />
      <SidebarAdmin />
      <main style={{ flex: 1, padding: "20px" }}>
        {/* Outlet là nội dung riêng của từng trang */}
        <Outlet /> 
      </main>
    </div>
  );
};

export default AdminLayout;

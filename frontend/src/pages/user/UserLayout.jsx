// src/layouts/AdminLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarUser } from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect } from "react";
import axios from "axios";

const UserLayout = () => {


  return (
    <div className="layout-container">
      <Navbar />
      <div className="layout-content">
        <SidebarUser />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserLayout ;

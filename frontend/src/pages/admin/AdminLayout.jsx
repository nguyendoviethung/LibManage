import { Outlet} from "react-router-dom";
import { SidebarAdmin } from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";

const AdminLayout = () => {

  return (
    <div className="layout-container">
      <Navbar />
      <div className="layout-content">
        <SidebarAdmin />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};  

export default AdminLayout;

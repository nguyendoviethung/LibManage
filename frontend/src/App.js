import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login.jsx';
import { BrowserRouter } from 'react-router-dom';
import AdminDashBoard from './pages/admin/AdminDashBoard.jsx';
import BookLendingAndReturningManagement from './pages/admin/BookLendingAndReturningManagement.jsx';
import BookManagement from './pages/admin/BookManagement.jsx';
import UserManagement from './pages/admin/ReaderManagement.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import BookSearch from './pages/user/BookSearch.jsx'
import DashboardUser from './pages/user/DashboardUser.jsx';
import MyAccount from './pages/user/MyAccount.jsx';
import MyBorrowedBooks from './pages/user/MyBorrowedBooks.jsx';
import UserLayout from './pages/user/UserLayout.jsx'
function App() {
  return (
    <BrowserRouter>
  <Routes>    
    {/* Trang login chung */}
    <Route path="/" element={<Login />} />
    
    {/* Layout cho admin */}
    {/* Khi đăng nhập thành công, ta dùng navigate('/admin-dashboard') để chuyển đến route /admin-dashboard.
    Route này được định nghĩa với element={<AdminLayout />}, nên React sẽ hiển thị component AdminLayout.
    Bên trong AdminLayout có Sidebar và một thẻ <Outlet /> - đây là nơi React sẽ "nhét" nội dung của các route con vào.
    Vì ta chỉ truy cập /admin-dashboard mà không kèm theo đường dẫn con nào (như /book-management), nên React Router sẽ tự động render route có index, tức là AdminDashBoard.
    Kết quả là: khi vừa đăng nhập, ta thấy giao diện quản trị (AdminLayout) với sidebar ở bên trái và nội dung trang AdminDashBoard ở bên phải. 
    và khi chuyển tran thì Phần Outlet sẽ thay đổi còn phần được khai báo trước đó trong AdminLayout được giữ nguyên*/}
   
      <Route path="/admin-dashboard" element={<AdminLayout />}>  
        <Route index element={<AdminDashBoard />} />
        <Route path="book-lending-and-returning-management" element={<BookLendingAndReturningManagement />} />
        <Route path="book-management" element={<BookManagement />} />
        <Route path="user-management" element={<UserManagement />} />
      </Route>

    {/* Layout cho user */}
    <Route path="/user/:id" element={<UserLayout />}>
      <Route path="profile" element={<MyAccount />} />
      <Route path="borrowed-books" element={<MyBorrowedBooks />} />
      <Route path="dashboard-user" element={<DashboardUser />} />
      <Route path="books-search" element={<BookSearch />} />
    </Route> 
    
  </Routes>
</BrowserRouter>

  );
}

export default App;

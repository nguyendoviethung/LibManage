import { Routes, Route } from 'react-router-dom';
import Login from './pages/login/Login.jsx';
import { BrowserRouter } from 'react-router-dom';
import AdminDashBoard from './pages/admin/AdminDashBoard.jsx';
import BookLendingAndReturningManagement from './pages/admin/BookLendingAndReturningManagement.jsx';
import BookManagement from './pages/admin/BookManagement.jsx';
import ReaderManagement from './pages/admin/ReaderManagement.jsx';
import AdminLayout from './pages/admin/AdminLayout.jsx';
import BookSearch from './pages/user/BookSearch.jsx'
import DashboardUser from './pages/user/DashboardUser.jsx';
import Feedback from './pages/user/Feedback.jsx';
import Profile from './pages/user/Profile.jsx';
import UserLayout from './pages/user/UserLayout.jsx';
import QAChat from './pages/admin/Chat.jsx';
import Chat from './pages/user/ChatUser.jsx'
import FaviconManager from './components/FaviconManager.jsx';

function App() {
  return (
<BrowserRouter>
  <FaviconManager />
  <Routes>    
    {/* Trang login chung */}
    <Route path="/" element={<Login />} />
    
    {/* Layout cho admin */}
    <Route path="/admin-dashboard" element={<AdminLayout />}>  
        <Route index element={<AdminDashBoard />} />
        <Route path="book-lending-and-returning-management" element={<BookLendingAndReturningManagement />} />
        <Route path="book-management" element={<BookManagement />} />
        <Route path="user-management" element={<ReaderManagement />} />
    </Route>

    <Route path="/admin-chat" element={<QAChat />}>
          <Route index element={<QAChat />} />
        </Route>
    
    {/* Layout cho user */}
    <Route path="/user/:id" element={<UserLayout />}>
      <Route index element={<DashboardUser />} />
      <Route path="books-search" element={<BookSearch />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="profile" element={<Profile />} />
      <Route path="chat" element={<Chat />} />
    </Route> 
  </Routes>
</BrowserRouter>

  );
}

export default App;
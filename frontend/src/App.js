import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login.jsx';
import { BrowserRouter } from 'react-router-dom';
import AdminDashboard from './pages/Dashboard/AdminDashboard.jsx';
import UserDashboard from './pages/Dashboard/UserDashboard.jsx';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard/admin" element={<AdminDashboard />} />
      <Route path="/dashboard/user/:userId" element={<UserDashboard />} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;

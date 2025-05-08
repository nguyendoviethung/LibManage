import React from 'react';
import Navbar from "../../components/navbar/Navbar"; // đường dẫn tuỳ thuộc cấu trúc dự án
import Sidebar from '../../components/sidebar/Sidebar';
import BookCategoryChart from '../../components/charts/BookCategoryChart.jsx';
function UserDashboard() {
  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <Sidebar />
        <BookCategoryChart /> 
        
        </div>
    </>
  );
}

export default UserDashboard;

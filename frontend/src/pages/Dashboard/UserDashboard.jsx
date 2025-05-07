import React from 'react';
import Navbar from "../../components/navbar/Navbar"; // đường dẫn tuỳ thuộc cấu trúc dự án

function UserDashboard() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '24px' }}>
        <h1>Dashboard</h1>
        <p>Welcome to the User Dashboard!</p>
      </div>
    </>
  );
}

export default UserDashboard;

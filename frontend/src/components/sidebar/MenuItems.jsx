import { faHouse, faBook, faUsers, faReceipt } from '@fortawesome/free-solid-svg-icons';

//File chứa các item của sidebar
// Menu của admin
export const menuItemsAdmin = [
  { label: "Home", path: "/admin-dashboard", icon: faHouse },
  { label: "Book Management", path: "/admin-dashboard/book-management", icon: faBook },
  { label: "Reader Management", path: "/admin-dashboard/user-management", icon: faUsers },
  { label: "Book Loan Management", path: "/admin-dashboard/book-lending-and-returning-management", icon: faReceipt },
];

//Lấy ID của tài khoản vừa đăng nhập ở trong local storage để sử dụng để điều hướng đến các trang liên quan của tài khoản đang dùng
const ID = localStorage.getItem("userID");
//Menu của reader
export const menuItemsUser = [
  { label: "Dashboard", path: `/user/${ID}`, icon: faHouse },
  { label: "Tìm kiếm sách", path: `/user/${ID}/books-search`, icon: faReceipt },
  { label: "Trang phản hồi", path: `/user/${ID}/feedback`, icon: faReceipt },
  { label: "Thông tin cá nhân", path: `/user/${ID}/profile`, icon: faReceipt },
];

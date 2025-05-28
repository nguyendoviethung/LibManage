import { faHouse, faBook, faUsers, faReceipt } from '@fortawesome/free-solid-svg-icons';

//File chứa các item của sidebar
export const menuItemsAdmin = [
  { label: "Home", path: "/admin-dashboard", icon: faHouse },
  { label: "Book Management", path: "/admin-dashboard/book-management", icon: faBook },
  { label: "Reader Management", path: "/admin-dashboard/user-management", icon: faUsers },
  { label: "Book Loan Management", path: "/admin-dashboard/book-lending-and-returning-management", icon: faReceipt },
];


const userID = localStorage.getItem("userID");

export const menuItemsUser = [
  { label: "Hồ sơ cá nhân", path: `/user/${userID}/profile`, icon: faHouse },
  { label: "Lịch sử mượn sách", path: `/user/${userID}/borrowed-books`, icon: faBook },
  { label: "Dashboard", path: `/user/${userID}/dashboard-user`, icon: faUsers },
  { label: "Tìm kiếm sách", path: `/user/${userID}/books-search`, icon: faReceipt },
];

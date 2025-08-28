
import { faHome, faBook, faUsers, faClipboardList ,faHouse, faMagnifyingGlass, faCommentDots, faUser,faComments, faHandHolding } from "@fortawesome/free-solid-svg-icons";

//File chứa các item của sidebar
// Menu của admin
export const menuItemsAdmin = [
  { label: "Home", path: "/admin-dashboard", icon: faHome },
  { label: "Book Management", path: "/admin-dashboard/book-management", icon: faBook },
  { label: "Reader Management", path: "/admin-dashboard/user-management", icon: faUsers },
  { label: "Borrow Books", path: "/admin-dashboard/book-lending-and-returning-management", icon: faHandHolding },
  { label: "Q&A Chat", path: "/admin-chat", icon: faComments },
];

//Lấy ID của tài khoản vừa đăng nhập ở trong local storage để sử dụng để điều hướng đến các trang liên quan của tài khoản đang dùng
//Menu của reader
// export const menuItemsUser = [
//   { label: "Dashboard", path: "", icon: faHouse },
//   { label: "Tìm kiếm sách", path: "books-search", icon: faMagnifyingGlass },
//   { label: "Trang phản hồi", path: "feedback", icon: faCommentDots },
//   { label: "Thông tin cá nhân", path: "profile", icon: faUser },
//   { label: "Q&A Chat", path: `/user/chat/:id`, icon: faComments },
// ]
// MenuItems.js
export const menuItemsUser = [
  { label: "Dashboard", icon: faHouse, buildPath: id => `/user/${id}` },
  { label: "Tìm kiếm sách", icon: faMagnifyingGlass, buildPath: id => `/user/${id}/books-search` },
  { label: "Trang phản hồi", icon: faCommentDots, buildPath: id => `/user/${id}/feedback` },
  { label: "Thông tin cá nhân", icon: faUser, buildPath: id => `/user/${id}/profile` },
  { label: "Q&A Chat", icon: faComments, buildPath: id => `/user/${id}/chat` },
];

import { faHouse, faBook, faUsers, faReceipt } from '@fortawesome/free-solid-svg-icons';

//File chứa các item của sidebar
export const menuItemsAdmin = [
  { label: "Home", path: "/admin-dashboard", icon: faHouse },
  { label: "Book Management", path: "/admin-dashboard/book-management", icon: faBook },
  { label: "Reader Management", path: "/admin-dashboard/user-management", icon: faUsers },
  { label: "Book Loan Management", path: "/admin-dashboard/book-lending-and-returning-management", icon: faReceipt },
];


export const menuItemsUser = [
  { label: "Home", path: "/dashboard", icon: faHouse }, 
  { label: "Book Management", path: "/book-management", icon: faBook },
  { label: "Reader Management", path: "/user-management", icon: faUsers },
  { label: "Book Loan Management", path: "/book-lending-and-return-management", icon: faReceipt },
];

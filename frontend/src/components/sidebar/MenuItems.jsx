import { faHouse, faBook, faUsers, faReceipt, faGear } from '@fortawesome/free-solid-svg-icons';

//File chứa các item của sidebar
export const menuItems = [
  { label: "Home", path: "/home", icon: faHouse },
  { label: "Book Management", path: "/book-management", icon: faBook },
  { label: "Reader Management", path: "/reader-management", icon: faUsers },
  { label: "Book Loan Management", path: "/book-loan-management", icon: faReceipt },
  { label: "Settings", path: "/settings", icon: faGear },
];

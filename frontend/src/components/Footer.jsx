import React from "react";
import "./Footer.scss";

export default function Footer() {
  return (
    <footer className="lib-footer">
      <div className="lib-footer-main">
        <div className="lib-footer-hust">HUST</div>
        <div className="lib-footer-title">
          ĐẠI HỌC BÁCH KHOA HÀ NỘI<br />
          KHOA TOÁN - TIN
        </div>
      </div>
      <div className="lib-footer-info">
        HỆ THỐNG QUẢN LÝ THƯ VIỆN<br />
        © 2024 Khoa Toán - Tin, ĐHBK Hà Nội | Room 106, D3 Building, 1 Dai Co Viet, Hai Ba Trung, Hanoi<br />
        Tel: (024) 3869 2137 | Email: fami@hust.edu.vn
      </div>
    </footer>
  );
} 
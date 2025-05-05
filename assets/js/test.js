// 1.Xử lí quét ảnh QR sinh viên và sách từ camera 
let qrScanner;  // Biến toàn cục chứa đối tượng Html5Qrcode

// Khi trang được tải xong
document.addEventListener("DOMContentLoaded", () => {
  let modal = document.getElementById("borrowBooksModal"); // Lấy modal từ id

  // Khi modal được mở, khởi tạo qrScanner
  modal.addEventListener("shown.bs.modal", () => {
    // Tạo đối tượng Html5Qrcode và truyền id của phần tử chứa camera
    // Nếu đã có qrScanner thì dừng nó trước khi khởi tạo lại
    qrScanner = new Html5Qrcode("reader");
  
    Html5Qrcode.getCameras().then(cameras => {
      if (cameras.length > 0) {
        qrScanner.start(
          cameras[0].id,
          { fps: 5, qrbox: 320 },
          (qrText) =>
          {
         alert(qrText); // Xử lý mã QR đã quét ở đây
        }
        ).catch(err => {
          console.error("Không thể khởi động camera:", err);
          alert("Không thể bật camera. Vui lòng kiểm tra quyền truy cập.");
        });
      } else {
        alert("Không tìm thấy camera.");
      }
    }).catch(err => {
      console.error("Lỗi khi lấy danh sách camera:", err);
    });
  });


  // 3. Xử lý khi đóng modal (người dùng nhấn nút đóng hoặc nhấn ra ngoài modal)
  modal.addEventListener("hidden.bs.modal", () => {
    // Đoạn này dùng khi sử dụng camera từ máy
    if (qrScanner) {
      qrScanner.stop().then(() => {
        document.getElementById("reader").innerHTML = "";
        qrScanner.clear(); // Xoá giao diện camera & giải phóng DOM (nhưng không hủy qrScanner)
        qrScanner = null; // Gán null để tạo mới lần sau (hủy tham chiếu đối tượng, khởi động lại)
      });
    }
    // Reset lại input file ảnh
    // document.getElementById("qrImageInput").value = "";


    document.getElementById("inputStudentID").value = ""; // Xóa mã sinh viên đã quét
    document.getElementById("inputBookID").value = ""; // Xóa mã sách đã quét
  });

});
// 1.Xử lí quét ảnh QR sinh viên và sách từ camera 

let currentStep = "student"; // Bắt đầu ở bước quét sinh viên
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
          { fps: 10, qrbox: 320 },
          (qrText) => handleQR(qrText)
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

  // 2. Xử lý khi chọn ảnh từ máy
  // document.getElementById("qrImageInput").addEventListener("change", function (e) {
  //   if (e.target.files.length === 0) return;
  //   let file = e.target.files[0];

  //   // ✅ Dừng camera trước khi quét ảnh để tránh lỗi chồng quét
  //   if (qrScanner) {
  //     qrScanner.stop().then(() => {
  //       qrScanner.scanFile(file, true)
  //         .then(decodedText => {
  //           handleQR(decodedText);
  //           document.getElementById("qrImageInput").value = ""; // ✅ Reset để quét lại được cùng ảnh nếu cần
  //         })
  //         .catch(err => {
  //           alert("Không đọc được mã QR từ ảnh.");
  //           console.error(err);
  //         });
  //     });
  //   }
  // });

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

    currentStep = "student"; // Đặt lại bước quét về sinh viên
    document.getElementById("inputStudentID").value = ""; // Xóa mã sinh viên đã quét
    document.getElementById("inputBookID").value = ""; // Xóa mã sách đã quét
  });

  // 4. Hàm xử lý nội dung QR (cả từ camera và ảnh)
  function handleQR(qrText) {
    const line = qrText.split("\n")[0]; // Lấy phần bên trái dấu "\n", tức là dòng đầu tiên
    const value = line.split(":")[1].trim();

    if (currentStep === "student") {
      fetch(".../../api/book-lending-and-returning-management/check-student.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          studentID: value      // Gửi mã sinh viên lên server
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            document.getElementById("inputStudentID").value = data.reader_id;
            currentStep = "book";
            alert("Sinh viên hợp lệ. Tiếp tục quét mã sách.");
          } else {
            alert(data.message);
          }
        });
    } else if (currentStep === "book") {
      document.getElementById("inputBookID").value = value;
      alert("Đã quét mã sách thành công.");
    }
  }
});

// 2. Gửi dữ liệu quét được lên server để xử lý

document.getElementById("qrForm").addEventListener("submit", function () {
  e.preventDefault(); // Ngăn chặn reload trang khi submit

  // Lấy giá trị từ các input
  let readerID = document.getElementById("inputStudentID").value;
  let bookID = document.getElementById("inputBookID").value;

  fetch(".../../api/book-lending-and-returning-management/borrow-book.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      readerID: readerID,
      bookID: bookID
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Mượn sách thành công!");
        document.getElementById("borrowBooksModal").modal("hide"); // Đóng modal sau khi mượn sách thành công
      } else {
        alert(data.message);
      }
    });
  })
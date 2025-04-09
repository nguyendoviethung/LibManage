// 1.Thêm người đọc mới
document.getElementById("addReaderForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    // Lấy dữ liệu từ form
    let addName = document.getElementById("addName").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    let addStudentID = document.getElementById("addStudentID").value.trim();
    let addEmail = document.getElementById("addEmail").value.trim();
    let addPhoneNumber = document.getElementById("addPhoneNumber").value.trim();
    let addFaculty = document.getElementById("addFaculty").value.trim();
   
    // Kiểm tra thông tin đầu vào
    if (addName === "" || addStudentID === "" ||addEmail === "" || addPhoneNumber === "" || addFaculty === "") {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch("add-reader.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            name: addName,
            studentID: addStudentID,
            email: addEmail,
            phoneNumber: addPhoneNumber,
            faculty: addFaculty
        })
    })
    .then(response => response.json()) // Giả sử server trả về JSON
    .then(data => {
        if (data.success) {
            // Thông báo thành công
            console.log(data)
            alert("Sách đã được thêm thành công!");
            // Reset form
            document.getElementById("addBookForm").reset();
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
         alert("Không thể thêm sách. Vui lòng thử lại.");
    }); 
});
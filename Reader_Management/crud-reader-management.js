// 1.Thêm người đọc mới
let lastStudentID = null; // Biến toàn cục để lưu StudentID cuối cùng đã được thêm vào
document.getElementById("addReaderForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    // Lấy dữ liệu từ form
    let addName = document.getElementById("addName").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    let addStudentID = document.getElementById("addStudentID").value.trim();
    let addEmail = document.getElementById("addEmail").value.trim();
    let addPhoneNumber = document.getElementById("addPhoneNumber").value.trim();
    let addFaculty = document.getElementById("addFaculty").value.trim();
    lastStudentID = addStudentID; // Cập nhật biến lastStudentID với StudentID mới nhất
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
    .then(response => response.json()) 
    .then(data => {
        if (data.success){
            // Thông báo thành công
            console.log(data);
            alert(data.message);
            // Reset form
            document.getElementById("addReaderForm").reset();
            $('#addReaderModal').modal('hide'); // Đóng modal sau khi thêm thành công
            // Cập nhật danh sách người đọc mới
            $('#addAccountReaderModal').modal('show');
    
        } else {
            // Thông báo lỗi
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
         alert("Có lỗi xảy ra, vui lòng thử lại!");
    }); 
});

// 2.Thêm tài khoản người đọc mới sau khi thêm người đọc thành công
document.getElementById("addAccountReaderForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    // Lấy dữ liệu từ form
    let addAccountUserName = document.getElementById("addAccountUserName").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    let addAccountPassword1 = document.getElementById("addAccountPassword1").value.trim();
    let addAccountPassword2 = document.getElementById("addAccountPassword2").value.trim();
    // Kiểm tra thông tin đầu vào
    if (addAccountUserName === "" || addAccountPassword1 === "" || addAccountPassword2 === "" ) {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    if( addAccountPassword1 !== addAccountPassword2) {
        alert("Mật khẩu không khớp. Vui lòng kiểm tra lại!");
        return;
    }
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch("add-account-reader.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            addAccountUserName: addAccountUserName,
            addAccountPassword1: addAccountPassword1,
            lastStudentID: lastStudentID // Sử dụng biến toàn cục để lấy StudentID cuối cùng đã được thêm vào
        })
    })
    .then(response => response.json()) // Giả sử server trả về JSON
    .then(data => {
        if (data.success){
            // Thông báo thành công
            console.log(data)
            alert(data.message);
            // Reset form
            document.getElementById("addAccountReaderForm").reset();
            $('#addAccountReaderModal').modal('hide'); // Đóng modal sau khi thêm thành công
    
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
         alert("Không thể thêm tài khoản.");
    });}) 

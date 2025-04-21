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
    fetch(".../../api/reader-management/add-reader.php", {
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
    fetch(".../../api/reader-management/add-account-reader.php", {
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

// 3.Tìm kiếm sinh viên 

document.getElementById("searchReaderForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    // Lấy dữ liệu từ form
    let searchStudentID = document.getElementById("searchStudentID").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    // Kiểm tra thông tin đầu vào
    if (searchStudentID === "") {
        alert("Vui lòng điền đầy đủ thông tin!");
        return;
    }
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch(".../../api/reader-management/search-reader.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            searchStudentID: searchStudentID,
        })
    })
    .then(response => response.json()) 
    .then(data => {
        const resultsText = document.getElementById("readerSearchResults");
        resultsText.style.display = "block"; // Hiện phần không gian kết quả tìm kiếm nếu có dữ liệu trả về
        document.getElementById("resultText").style.display = "block"; // Hiện "Kết quả tìm kiếm" khi có dữ liệu trả về:
        // Kiểm tra xem có dữ liệu trả về không
    if (data.success) {
    const reader = data.data;
    // const resultsContainer = document.getElementById("readerSearchResults");
    const html = `
    <div class="table-responsive mt-3">
        <table class="table table-bordered table-hover align-middle">
            <thead class="table-light">
                <tr>
                    <th scope="col">Mã SV</th>
                    <th scope="col">Họ tên</th>
                    <th scope="col">Email</th>
                    <th scope="col">SĐT</th>
                    <th scope="col">Khoa</th>
                    <th scope="col">Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${reader.student_id}</td>
                    <td>${reader.full_name}</td>
                    <td>${reader.email}</td>
                    <td>${reader.phone_number}</td>
                    <td>${reader.faculty}</td>
                    <td>${reader.status}</td>
                </tr>
            </tbody>
        </table>
    </div>
`;
                resultsText.innerHTML = html;

        } else {
            // Thông báo lỗi
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
         alert("Có lỗi xảy ra, vui lòng thử lại!");
    }); 
})

// 4.Cập nhật , chỉnh sửa thông tin người đọc
// 4.1.Hiện modal cập nhật thông tin người đọc

let originalStudentID = "";  // Biến toàn cục để lưu MSSV ban đầu trước khi cập nhật
document.getElementById("updateStudentForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    // Lấy dữ liệu từ form
    let searchStudentID = document.getElementById("updateStudentID").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch(".../../api/reader-management/search-reader.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            searchStudentID: searchStudentID,
        })
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.success){
            // Reset form
            document.getElementById("updateStudentForm").reset();
            // Hiển thị thông tin người đọc trong modal
            $('#updateReaderAfterModal').modal('show'); // Đóng modal sau khi thêm thành công
            document.getElementById("updateReaderAfterName").value = data.data.full_name;
            document.getElementById("updateReaderAfterID").value = data.data.student_id;
            document.getElementById("updateReaderAfterEmail").value = data.data.email;
            document.getElementById("updateReaderAfterPhoneNumber").value = data.data.phone_number;
            document.getElementById("updateReaderAfterFaculty").value = data.data.faculty;
            document.getElementById("updateReaderAfterStatus").value = data.data.status;
            originalStudentID = data.data.student_id; // Biến toàn cục để lưu StudentID cuối cùng đã được thêm vào
        } else {
            // Thông báo lỗi
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
         alert("Có lỗi xảy ra, vui lòng thử lại!");
    }); 
})

// 4.2.Cập nhật thông tin người đọc sau khi modal hiện ra
document.getElementById("updateReaderAfterForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    // Lấy dữ liệu từ form
    let updateName = document.getElementById("updateReaderAfterName").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    let updateStudentID = document.getElementById("updateReaderAfterID").value.trim();
    let updateEmail = document.getElementById("updateReaderAfterEmail").value.trim();
    let updatePhoneNumber = document.getElementById("updateReaderAfterPhoneNumber").value.trim();
    let updateFaculty = document.getElementById("updateReaderAfterFaculty").value.trim();
    let updateStatus = document.getElementById("updateReaderAfterStatus").value.trim();
    let keepAccountStatus = document.getElementById("keepAccountStatus").checked; // Lấy giá trị của checkbox "Giữ nguyên trạng thái tài khoản" (1 hoặc 0)
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch(".../../api/reader-management/update-reader.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            name: updateName,
            studentID: updateStudentID,
            email: updateEmail,
            phoneNumber: updatePhoneNumber,
            faculty: updateFaculty,
            status: updateStatus,
            originalStudentID : originalStudentID, // Biến toàn cục để lưu StudentID cuối cùng đã được thêm vào
            keepAccountStatus : keepAccountStatus
        })
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.success){
            // Thông báo thành công
            console.log(data);
            alert(data.message);
            // Reset form
            document.getElementById("updateReaderAfterForm").reset();
            $('#updateReaderAfterModal').modal('hide'); // Đóng modal sau khi thêm thành công
    
        } else {
            // Thông báo lỗi
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
         alert("Có lỗi xảy ra, vui lòng thử lại!");
    }); 
})

// 5.Chỉnh sửa tài khoản người đọc
// 5.1.Tìm kiếm và hiện status cũ , form để chỉnh sửa password 

let searchByStudentID = ""; // Biến toàn cục để lưu StudentID tìm kiếm cho mục đích cập nhật tài khoản
document.getElementById("searchForReaderAccountForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    // Lấy dữ liệu từ form
    let searchStudentID = document.getElementById("searchForReaderAccountID").value.trim(); 
    searchByStudentID = searchStudentID; // Cập nhật biến searchByStudentID với StudentID mới nhất
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch(".../../api/reader-management/search-account.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            searchStudentID : searchStudentID
        })
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.success){
            console.log(data);
            document.getElementById("searchForReaderAccountForm").reset();
            $('#changeAccountModal').modal('show'); //Hiện modal sau khi tìm kiếm thành công
            document.getElementById("changeAccountStatus").value = data.data.status; //Lấy trạng thái cũ
        } else {
            console.log(data);
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
         alert("Có lỗi xảy ra, vui lòng kiểm tra lại.");

})})

// 5.2.Cập nhật tài khoản sinh viên sau khi modal hiện ra
document.getElementById("changeAccountForm").addEventListener("submit", function (e) { 
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    // Lấy dữ liệu từ form
    let changeAccountPasswordNew1 = document.getElementById("changeAccountPasswordNew1").value.trim();
    let changeAccountPasswordNew2 = document.getElementById("changeAccountPasswordNew2").value.trim();
    let changeAccountStatus = document.getElementById("changeAccountStatus").value;
    if(changeAccountPasswordNew1 !== changeAccountPasswordNew2) {
        alert("Mật khẩu không khớp. Vui lòng kiểm tra lại!");
        return;
    }
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch(".../../api/reader-management/update-account.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            changeAccountPasswordNew1: changeAccountPasswordNew1,
            changeAccountStatus: changeAccountStatus,
            searchByStudentID  : searchByStudentID, 
        })
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.success){
            // Thông báo thành công
            console.log(data)
            alert(data.message);
            // Reset form
            document.getElementById("changeAccountForm").reset();
            $('#changeAccountModal').modal('hide'); // Đóng modal sau khi thêm thành công
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
         alert(data.message); 
})})

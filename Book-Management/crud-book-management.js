// document.getElementById("addBookForm").addEventListener("submit", function(e) {
//     e.preventDefault(); // Ngăn chặn reload trang
//     console.log("Submit button clicked");  // Để kiểm tra nếu sự kiện submit được kích hoạt
    
//     // Tiến hành gửi yêu cầu AJAX
// });

// 1. Script xử lý thêm sách mới
document.getElementById("addBookForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    // Lấy dữ liệu từ form
    let additionalBookTitle = document.getElementById("additionalBookTitle").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    let authorNameAdded = document.getElementById("authorNameAdded").value.trim();
    let bookLang = document.getElementById("bookLang").value.trim();
    let publishYear = document.getElementById("publishYear").value.trim();
    let bookLocation = document.getElementById("bookLocation").value.trim();
    let genre = document.getElementById("genre").value.trim()
    // let publisherId = document.getElementById("publisherId").value;
    let quantity = document.getElementById("quantity").value.trim();
    // Kiểm tra thông tin đầu vào
    if (additionalBookTitle === "" || authorNameAdded === "") {
        alert("Vui lòng nhập tên sách và tên tác giả!");
        return;
    }
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch("add-book.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            additionalBookTitle: additionalBookTitle,
            authorNameAdded: authorNameAdded,
            bookLang: bookLang,
            publishYear: publishYear,
            bookLocation: bookLocation,
            genre: genre,
            quantity: quantity
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

//2. Script xử lý tìm kiếm sách 

document.getElementById("searchBookForm").addEventListener("submit", function (e){
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    let bookName = document.getElementById("searchBook").value;
    if (bookName.trim() === "") {
        alert("Vui lòng nhập tên sách!");
        return;
    }
    // Gửi request AJAX với JSON tới file PHP xử lý tìm kiếm
    fetch("search-book.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Đổi thành application/json
        },
        body: JSON.stringify({ bookName: bookName }) // Gửi dữ liệu dưới dạng JSON
    })
    .then(response => response.json()) // Xử lý dữ liệu trả về từ PHP dưới dạng JSON
    .then(data => {
        // Hiển thị kết quả vào phần tử #searchResults
        if (data.error) {
            console.log(data.error);
            document.getElementById("searchResults").innerHTML = data.error;
        } else if (data.message) {
            console.log(data.message);
            document.getElementById("searchResults").innerHTML = data.message;
        } else {
            //Hiện phần tử Search Results
            document.getElementById("search_results").style.display = "block"; 
            console.log(data);
            let resultHTML = "<table><tr><th>Title</th><th>Language</th><th>Year</th><th>Location</th><th>Genre</th><th>Quantity</th><th>Author Name</th></tr>";
            data.forEach(book => {
                resultHTML += `<tr>
                    <td>${book.title}</td>
                    <td>${book.lang}</td>
                    <td>${book.publisher_year}</td>
                    <td>${book.location}</td>
                    <td>${book.genre}</td>
                    <td>${book.quantity}</td>
                    <td>${book.author_name}</td>
                </tr>`;
            });
            resultHTML += "</table>";
            document.getElementById("searchResults").innerHTML = resultHTML;
        }
    })
    .catch(error => console.error("❌Lỗi:", error));
    // Hiển thị thông báo lỗi nếu có phía server(Lỗi truy vấn SQL, lỗi kết nối DB,...)
    document.getElementById("search_results").style.display = "block";
    document.getElementById("searchResults").innerHTML = "Lỗi phía server";
});

// 3. Script xử lý trước khi cập nhật sách

document.getElementById("editBookForm").addEventListener("submit", function(e){
    e.preventDefault();
    let bookTitle = document.getElementById("updateBookTitle").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    if (bookTitle === "" ) {
        alert("Vui lòng nhập tên sách!");
        return;
    }
    fetch("update-book.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bookTitle : bookTitle })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
           // Đưa dữ liệu vào input của modal dùng cập nhật lại sách (Modal thứ 2)  
            document.getElementById("bookTitleUpdate").value = data.book.title;
            document.getElementById("bookAuthorUpdate").value = data.book.author_name;
            document.getElementById("bookLangUpdate").value = data.book.lang;
            document.getElementById("publishYearUpdate").value = data.book.publisher_year;
            document.getElementById("bookLocationUpdate").value = data.book.location;
            document.getElementById("bookGenreUpdate").value = data.book.genre;
            document.getElementById("bookQuantityUpdate").value = data.book.quantity;
            $('#updateBookAfterSearch').modal('show'); // Modal cập nhật sách hiện lên
          
        } else {
         alert( data.message);
        }
    })
     .catch(error => console.error("Lỗi:", error));
});

// 4. Script xử lý cập nhật sách sau khi tìm kiếm
document.getElementById("updateBookAfterSearchForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    let titleAfterUpdate = document.getElementById("bookTitleUpdate").value; // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    let authorNameAfterUpdate = document.getElementById("bookAuthorUpdate").value;
    let bookLangAfterUpdate = document.getElementById("bookLangUpdate").value;
    let publisherYearAfterUpdate = document.getElementById("publishYearUpdate").value;
    let bookLocationAfterUpdate = document.getElementById("bookLocationUpdate").value;
    let genreAfterUpdate = document.getElementById("bookGenreUpdate").value;
    let quantityAfterUpdate = document.getElementById("bookQuantityUpdate").value;
    if(titleAfterUpdate === "" || authorNameAfterUpdate === "") {
        alert("Vui lòng nhập tên sách và tên tác giả!");
        return;
    }
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch("after-update.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            titleAfterUpdate: titleAfterUpdate,
            authorNameAfterUpdate: authorNameAfterUpdate,
            bookLangAfterUpdate: bookLangAfterUpdate,
            publisherYearAfterUpdate: publisherYearAfterUpdate,
            bookLocationAfterUpdate: bookLocationAfterUpdate,
            genreAfterUpdate: genreAfterUpdate,
            quantityAfterUpdate: quantityAfterUpdate
        })
    })
    .then(response => response.json()) // Giả sử server trả về JSON
    .then(data => {
        if (data.success) {
            // Thông báo thành công
            alert("Sách đã được cập nhật thành công!");
            // Reset form
            document.getElementById("updateBookAfterSearchForm").reset();
        } else {
            alert("Có lỗi xảy ra: " + data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
        alert("Không thể cập nhật sách. Vui lòng thử lại.");
    });
});

document.querySelector('.btn-danger').addEventListener('click', function() {
    console.log('Modal Delete Book triggered');
    var myModal = new bootstrap.Modal(document.getElementById('deleteBook'));
    myModal.show();
});

// 5. Script xử lý xóa sách
document.addEventListener('DOMContentLoaded', function () {
    // Khi DOM đã được tải xong, thêm sự kiện vào form
    document.getElementById("bookNameDeleteForm").addEventListener("submit", function (e) {
        e.preventDefault(); // Ngăn chặn reload trang khi submit
        let bookName = document.getElementById("bookNameDelete").value.trim();
        // Kiểm tra nếu tên sách trống
        if (bookName === "") {
            alert("Vui lòng nhập tên sách!");
            return;
        }
        // Gửi yêu cầu AJAX với JSON tới file PHP xử lý xóa sách
        fetch("delete-book.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ bookName: bookName }) // Gửi tên sách dưới dạng JSON
        })
        .then(response => response.json()) // Giả sử server trả về JSON
        .then(data => {
            if (data.success) {
                alert("Sách đã được xóa thành công!");
                // Đóng modal sau khi xóa thành công
                $('#bookNameDeleteModal').modal('hide');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Có lỗi khi gửi yêu cầu:", error);
            alert("Không thể xóa sách. Vui lòng thử lại.");
        });
    });
});


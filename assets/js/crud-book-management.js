// File này chứa các script xử lý CRUD cho sách trong hệ thống quản lý thư viện
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
    let quantity = document.getElementById("quantity").value.trim();

    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch(".../../api/book-management/add-book.php", {
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
    let bookName = document.getElementById("searchBook").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    // Gửi request AJAX với JSON tới file PHP xử lý tìm kiếm
    fetch(".../../api/book-management/search-book.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Đổi thành application/json
        },
        body: JSON.stringify({ bookName: bookName }) // Gửi dữ liệu dưới dạng JSON
    })
    .then(response => response.json()) // Xử lý dữ liệu trả về từ PHP dưới dạng JSON
    .then(data => {
        // Hiển thị kết quả vào phần tử #searchResults
        if (data.success) {
            console.log(data); // Kiểm tra dữ liệu trả về từ server
            let bookresults = data.books; // Giả sử bạn đang trả về "data" chứa thông tin sách
            const html = `
                <div class="table-responsive mt-3">
                    <table class="table table-bordered table-hover align-middle">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">Tên sách</th>
                                <th scope="col">Ngôn ngữ</th>
                                <th scope="col">Năm xuất bản</th>
                                <th scope="col">Location</th>
                                <th scope="col">Thể loại</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Tên tác giả</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${bookresults.title}</td>
                                <td>${bookresults.lang}</td>
                                <td>${bookresults.publisher_year}</td>
                                <td>${bookresults.location}</td>
                                <td>${bookresults.genre}</td>
                                <td>${bookresults.quantity}</td>
                                <td>${bookresults.author_name}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        
            document.getElementById("searchResults").innerHTML = html; // đúng biến!
            document.getElementById("search_results").style.display = "block"; // hiện dòng "Search Results"
        } else {
            alert(data.message); 
        }
        
    })
    .catch(error => console.error("❌Lỗi:", error));
    // Hiển thị thông báo lỗi nếu có phía server(Lỗi truy vấn SQL, lỗi kết nối DB,...)

});

// 3. Script xử lý trước khi cập nhật sách

document.getElementById("searchBookTitleForUpdatesForm").addEventListener("submit", function(e){
    e.preventDefault(); // Ngăn chặn reload trang khi submit
    let bookName = document.getElementById("searchBookTitleForUpdates").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    fetch(".../../api/book-management/search-book.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ bookName : bookName })
    })  
    .then(response => response.json())
    .then(data => {
        if (data.success) {
           // Đưa dữ liệu vào input của modal dùng cập nhật lại sách (Modal thứ 2)  
            document.getElementById("bookTitleUpdate").value = data.books.title;
            document.getElementById("bookAuthorUpdate").value = data.books.author_name;
            document.getElementById("bookLangUpdate").value = data.books.lang;
            document.getElementById("publishYearUpdate").value = data.books.publisher_year;
            document.getElementById("bookLocationUpdate").value = data.books.location;
            document.getElementById("bookGenreUpdate").value = data.books.genre;
            document.getElementById("bookQuantityUpdate").value = data.books.quantity;
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
    let titleAfterUpdate = document.getElementById("bookTitleUpdate").value.trim(); // Lấy giá trị từ input và xóa khoảng trắng đầu và cuối
    let authorNameAfterUpdate = document.getElementById("bookAuthorUpdate").value.trim();
    let bookLangAfterUpdate = document.getElementById("bookLangUpdate").value.trim();
    let publisherYearAfterUpdate = document.getElementById("publishYearUpdate").value.trim();
    let bookLocationAfterUpdate = document.getElementById("bookLocationUpdate").value.trim();
    let genreAfterUpdate = document.getElementById("bookGenreUpdate").value.trim();
    let quantityAfterUpdate = document.getElementById("bookQuantityUpdate").value.trim();
    // Gửi request AJAX với JSON tới file PHP xử lý
    fetch(".../../api/book-management/update-book.php", {
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
            $('#updateBookAfterSearch').modal('hide');
        } else {
            alert("Có lỗi xảy ra: " + data.message);
        }
    })
    .catch(error => {
        console.error("Có lỗi khi gửi yêu cầu:", error);
        alert("Không thể cập nhật sách. Vui lòng thử lại.");
    });
});
// 5. Script xử lý xóa sách

    // Khi DOM đã được tải xong, thêm sự kiện vào form
    document.getElementById("bookNameDeleteForm").addEventListener("submit", function (e) {
        e.preventDefault(); // Ngăn chặn reload trang khi submit
        let bookName = document.getElementById("bookNameDelete").value.trim();
       
        // Gửi yêu cầu AJAX với JSON tới file PHP xử lý xóa sách
        fetch(".../../api/book-management/delete-book.php", {
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



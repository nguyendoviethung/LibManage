<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  <link rel="stylesheet" href="./assets/css/interface.css">
  <link rel="stylesheet" href="./assets/css/index.css">
</head>
<body class="bg-body-secondary">
  <!--Navbar -->
  <div>
    <nav class="navbar navbar-expand-lg border-bottom" style="background-color: #fdfeff;">
      <div class="container">
        <a class="navbar-brand" href="#">
            <!-- L -->
            <svg xmlns="http://www.w3.org/2000/svg" height="28" width="18" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M64 32c17.7 0 32 14.3 32 32l0 352 192 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L64 480c-17.7 0-32-14.3-32-32L32 64c0-17.7 14.3-32 32-32z"/></svg>
          <!-- I -->
          <svg xmlns="http://www.w3.org/2000/svg" height="28" width="18" viewBox="0 0 320 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l96 0 0 320-96 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0 0-320 96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L160 32 32 32z"/></svg>
          <!-- U -->
          <svg xmlns="http://www.w3.org/2000/svg" height="35" width="21" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M32 32c17.7 0 32 14.3 32 32l0 224c0 70.7 57.3 128 128 128s128-57.3 128-128l0-224c0-17.7 14.3-32 32-32s32 14.3 32 32l0 224c0 106-86 192-192 192S0 394 0 288L0 64C0 46.3 14.3 32 32 32z"/></svg>
        </a>
        <span style="margin-left: 350px;"></span>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <div class="d-flex w-100 justify-content-end align-items-center gap-3">
            <!-- Email -->
            <a class="nav-link" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" width = 26 px height = 26px  viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M64 112c-8.8 0-16 7.2-16 16l0 22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1l0-22.1c0-8.8-7.2-16-16-16L64 112zM48 212.2L48 384c0 8.8 7.2 16 16 16l384 0c8.8 0 16-7.2 16-16l0-171.8L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64l384 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64L64 448c-35.3 0-64-28.7-64-64L0 128z"/></svg>
            </a>
            <!-- Thông báo -->
            <a class="nav-link" href="#">
                <svg xmlns="http://www.w3.org/2000/svg" widt = 26px height = 26px viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416l400 0c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4l0-25.4c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112l0 25.4c0 47.9 13.9 94.6 39.7 134.6L72.3 368C98.1 328 112 281.3 112 233.4l0-25.4c0-61.9 50.1-112 112-112zm64 352l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z"/></svg>
            </a>
            <!-- Tìm kiếm -->
            <form class="d-flex " role="search">
              <input class="form-control" type="search" placeholder="Search" />
            </form>
            <!-- Nút Submit -->
            <button class="btn btn-outline-danger  d-flex align-items-center justify-content-center" type="submit">
                <svg xmlns="http://www.w3.org/2000/svg" width = 20 px height = 20 px  viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>  
  </div>
    
  <!-- Sidebar + Main Content -->
   <div class="d-flex" >
      <!-- Sidebar-->
  <div class="sidebar ">
    <ul class="nav d-flex content-center flex-column">
      <!-- Home -->
      <li class="nav-item mb-2 mt-2">
        <div class="custom-hover">
          <a class="nav-link d-flex align-items-center" href="./index.php"> 
            <svg xmlns="http://www.w3.org/2000/svg" width = 23px height = 23px viewBox="0 0 576 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/></svg>
              <path fill="#597b91" d="M575.8 255.5c0 18-15 32.1-32 32.1l-32 0 .7 160.2c0 2.7-.2 5.4-.5 8.1l0 16.2c0 22.1-17.9 40-40 40l-16 0c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1L416 512l-24 0c-22.1 0-40-17.9-40-40l0-24 0-64c0-17.7-14.3-32-32-32l-64 0c-17.7 0-32 14.3-32 32l0 64 0 24c0 22.1-17.9 40-40 40l-24 0-31.9 0c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2l-16 0c-22.1 0-40-17.9-40-40l0-112c0-.9 0-1.9 .1-2.8l0-69.7-32 0c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z"/>
            </svg>
            <span class="ms-2">Home</span>
          </a>
        </div>
      </li>
      
      <!-- Book Management -->
      <li class="nav-item mb-1">
        <div class="custom-hover">
          <a class="nav-link d-flex align-items-center" href="./book-management.php">
            <svg xmlns="http://www.w3.org/2000/svg" width = 21px height = 21px viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>
              <path fill="#4e5f7e" d="M96 0C43 0 0 43 0 96L0 416c0 53 43 96 96 96l288 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-64c17.7 0 32-14.3 32-32l0-320c0-17.7-14.3-32-32-32L384 0 96 0zm0 384l256 0 0 64L96 448c-17.7 0-32-14.3-32-32s14.3-32 32-32zm32-240c0-8.8 7.2-16 16-16l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16zm16 48l192 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-192 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/>
            </svg>
            <span class="ms-2">Book Management</span>
          </a>
        </div>
      </li>
      
      <!-- Reader Management -->
      <li class="nav-item mb-1">
        <div class="custom-hover">
          <a class="nav-link d-flex align-items-center" href="./reader-management.php">
            <svg xmlns="http://www.w3.org/2000/svg" width = 21px height = 21px  viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152l0 264-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427L0 224c0-17.7 14.3-32 32-32l30.3 0c63.6 0 125.6 19.6 177.7 56zm32 264l0-264c52.1-36.4 114.1-56 177.7-56l30.3 0c17.7 0 32 14.3 32 32l0 203c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"/></svg>
              <path fill="#5d697e" d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152l0 264-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427L0 224c0-17.7 14.3-32 32-32l30.3 0c63.6 0 125.6 19.6 177.7 56zm32 264l0-264c52.1-36.4 114.1-56 177.7-56l30.3 0c17.7 0 32 14.3 32 32l0 203c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"/>
            </svg>
            <span class="ms-2">Reader Management</span>
          </a>
        </div>
      </li>

      <!-- Borrow And Return Books -->
      <li class="nav-item mb-1">
        <div class="custom-hover">
          <a class="nav-link d-flex align-items-center" href="#">
          <svg xmlns="http://www.w3.org/2000/svg"  width = 21px height = 21px viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M32 96l320 0 0-64c0-12.9 7.8-24.6 19.8-29.6s25.7-2.2 34.9 6.9l96 96c6 6 9.4 14.1 9.4 22.6s-3.4 16.6-9.4 22.6l-96 96c-9.2 9.2-22.9 11.9-34.9 6.9s-19.8-16.6-19.8-29.6l0-64L32 160c-17.7 0-32-14.3-32-32s14.3-32 32-32zM480 352c17.7 0 32 14.3 32 32s-14.3 32-32 32l-320 0 0 64c0 12.9-7.8 24.6-19.8 29.6s-25.7 2.2-34.9-6.9l-96-96c-6-6-9.4-14.1-9.4-22.6s3.4-16.6 9.4-22.6l96-96c9.2-9.2 22.9-11.9 34.9-6.9s19.8 16.6 19.8 29.6l0 64 320 0z"/></svg> 
            <span class="ms-2">Borrow And Return Books</span>
          </a>
        </div>
      </li>
    </ul>
  </div>
  
  <!-- Main Content -->
  <div class="overflow-scroll content">
  <h2 class="text-center fw-bold mb-4" style="color: rgb(73, 143, 208)" >Manage Book Borrowing And Returning</h2>
  <div class="container mt-5">
  <div class="row justify-content-center mb-3">
    <!-- Quét mã QRcode mượn sách  -->
    <div class="col-md-3 ">
      <div class="feature-card text-center" onclick="loadFeature('borrowBooks')" data-bs-toggle="modal" data-bs-target="#borrowBooksModal">
      <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 448 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#48eab9" d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
        <div class="mt-2 fw-bold" style="color:#498FD0">Mượn sách</div>
      </div>
    </div>

    <!-- Quét mã QRcode trả sách -->
    <div class="col-md-3">
      <div class="feature-card text-center" onclick="loadFeature('searchReader')" data-bs-toggle="modal" data-bs-target="#searchReaderModal">
      <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#fbca18" d="M48.5 224L40 224c-13.3 0-24-10.7-24-24L16 72c0-9.7 5.8-18.5 14.8-22.2s19.3-1.7 26.2 5.2L98.6 96.6c87.6-86.5 228.7-86.2 315.8 1c87.5 87.5 87.5 229.3 0 316.8s-229.3 87.5-316.8 0c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0c62.5 62.5 163.8 62.5 226.3 0s62.5-163.8 0-226.3c-62.2-62.2-162.7-62.5-225.3-1L185 183c6.9 6.9 8.9 17.2 5.2 26.2s-12.5 14.8-22.2 14.8L48.5 224z"/></svg>
        <div class="mt-2 fw-bold" style="color:#498FD0">Trả sách</div>
      </div>
    </div>

   
<!-- Modal mượn sách  -->

<div class="modal fade" id="borrowBooksModal" tabindex="-1" aria-labelledby="qrModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content p-3 shadow rounded-3">
      <div class="modal-header border-bottom">
        <h5 class="modal-title" id="qrModalLabel"> Quét mã QR</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body">
      
        <form id="qrForm">
          <!-- Camera -->
          <div class="d-flex justify-content-center mb-3">
            <div id="reader" style="width: 100%; max-width: 480px; height: 360px;"></div>
          </div>    

          <!-- Kết quả -->
          <div class="mb-3">
            <label for="inputStudentID" class="form-label">Mã sinh viên:</label>
            <input type="text" id="inputStudentID" class="form-control" readonly>
          </div>

          <div class="mb-3">
            <label for="inputStudentID" class="form-label">Mã sinh viên:</label>
            <input type="text" id="inputBookID" class="form-control" readonly>
          </div>


          <!-- Gửi -->
          <div class="text-center">
            <button type="submit" class="btn btn-primary">Xác nhận mượn</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

<!-- Xử lý active cho sidebar -->
<script>
  document.querySelectorAll('.custom-hover').forEach(item => {
    item.addEventListener('click', function () {
      document.querySelectorAll('.custom-hover').forEach(el => el.classList.remove('active'));
      this.classList.add('active');
    });
  });
</script>

  <!-- Script xử lý active state cho sidebar -->
  <script>
    document.querySelectorAll('.custom-hover').forEach(item => {
      item.addEventListener('click', function() {
        // Xóa active ở tất cả các sidebar item
        document.querySelectorAll('.custom-hover').forEach(el => {
          el.classList.remove('active');
        });
        // Thêm active vào item được nhấp
        this.classList.add('active');
      });
    });
  </script>
<script src="./assets/js/test.js"></script>
</body>
</html>

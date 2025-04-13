<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Document</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="../CSS/interface.css">
</head>
<body class="bg-body-secondary">
  <div> 
    <!-- Navbar -->
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
            <button class="btn btn-outline-danger   d-flex align-items-center justify-content-center" type="submit">
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
          <a class="nav-link d-flex align-items-center" href="../Home/home.php"> 
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
          <a class="nav-link d-flex align-items-center" href="../Book-Management/book-management.php">
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
          <a class="nav-link d-flex align-items-center" href="#">
            <svg xmlns="http://www.w3.org/2000/svg" width = 21px height = 21px  viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152l0 264-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427L0 224c0-17.7 14.3-32 32-32l30.3 0c63.6 0 125.6 19.6 177.7 56zm32 264l0-264c52.1-36.4 114.1-56 177.7-56l30.3 0c17.7 0 32 14.3 32 32l0 203c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"/></svg>
              <path fill="#5d697e" d="M160 96a96 96 0 1 1 192 0A96 96 0 1 1 160 96zm80 152l0 264-48.4-24.2c-20.9-10.4-43.5-17-66.8-19.3l-96-9.6C12.5 457.2 0 443.5 0 427L0 224c0-17.7 14.3-32 32-32l30.3 0c63.6 0 125.6 19.6 177.7 56zm32 264l0-264c52.1-36.4 114.1-56 177.7-56l30.3 0c17.7 0 32 14.3 32 32l0 203c0 16.4-12.5 30.2-28.8 31.8l-96 9.6c-23.2 2.3-45.9 8.9-66.8 19.3L272 512z"/>
            </svg>
            <span class="ms-2">Reader Management</span>
          </a>
        </div>
      </li>
      
      <!-- User Management -->
      <li class="nav-item mb-1">
        <div class="custom-hover">
          <a class="nav-link d-flex align-items-center" href="user_management.html">
            <svg xmlns="http://www.w3.org/2000/svg" width = 25px height = 25 px  viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/></svg>
              <path fill="#5b6e8f" d="M144 0a80 80 0 1 1 0 160A80 80 0 1 1 144 0zM512 0a80 80 0 1 1 0 160A80 80 0 1 1 512 0zM0 298.7C0 239.8 47.8 192 106.7 192l42.7 0c15.9 0 31 3.5 44.6 9.7c-1.3 7.2-1.9 14.7-1.9 22.3c0 38.2 16.8 72.5 43.3 96c-.2 0-.4 0-.7 0L21.3 320C9.6 320 0 310.4 0 298.7zM405.3 320c-.2 0-.4 0-.7 0c26.6-23.5 43.3-57.8 43.3-96c0-7.6-.7-15-1.9-22.3c13.6-6.3 28.7-9.7 44.6-9.7l42.7 0C592.2 192 640 239.8 640 298.7c0 11.8-9.6 21.3-21.3 21.3l-213.3 0zM224 224a96 96 0 1 1 192 0 96 96 0 1 1 -192 0zM128 485.3C128 411.7 187.7 352 261.3 352l117.3 0C452.3 352 512 411.7 512 485.3c0 14.7-11.9 26.7-26.7 26.7l-330.7 0c-14.7 0-26.7-11.9-26.7-26.7z"/>
            </svg>
            <span class="ms-2">User Management</span>
          </a>
        </div>
      </li>
      
      <!-- Settings -->
      <li class="nav-item mb-1">
        <div class="custom-hover">
          <a class="nav-link d-flex align-items-center" href="setting.html">
            <svg xmlns="http://www.w3.org/2000/svg"width = 24px height = 24px viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#5a7fbf" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
              <path fill="#6f7e9b" d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/>
            </svg>
            <span class="ms-2">Settings</span>
          </a>
        </div>
      </li>
    </ul>
  </div>
  
  <!-- Main Content -->
  <div class="content">
       <h2 class="text-center fw-bold mb-4" style="color: rgb(73, 143, 208)" >Reader Management</h2>
  <div class="container mt-5">
  <div class="row justify-content-center mb-3">
    <!-- Thêm sinh viên -->
    <div class="col-md-3 ">
      <div class="feature-card text-center" onclick="loadFeature('addBook')" data-bs-toggle="modal" data-bs-target="#addReaderModal">
      <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="rgb(84, 238, 102)" d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304l91.4 0C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7L29.7 512C13.3 512 0 498.7 0 482.3zM504 312l0-64-64 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l64 0 0-64c0-13.3 10.7-24 24-24s24 10.7 24 24l0 64 64 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-64 0 0 64c0 13.3-10.7 24-24 24s-24-10.7-24-24z"/></svg>
        <div class="mt-2 fw-bold" style="color: rgb(84, 238, 102)">Thêm sinh viên</div>
      </div>
    </div>

    <!-- Tìm kiếm sinh viên -->
    <div class="col-md-3">
      <div class="feature-card text-center" onclick="loadFeature('searchReader')" data-bs-toggle="modal" data-bs-target="#searchReaderModal">
      <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 512 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#ffde66" d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
        <div class="mt-2 fw-bold" style="color: rgb(251, 204, 35)">Tìm kiếm sinh viên</div>
      </div>
    </div>

    <!-- Chỉnh sửa thông tin sinh viên -->
    <div class="col-md-3 ">
      <div class="feature-card text-center" onclick="loadFeature('updateReader')" data-bs-toggle="modal" data-bs-target="#updateStudentModal">
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 640 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path fill="#81c2f3" d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l293.1 0c-3.1-8.8-3.7-18.4-1.4-27.8l15-60.1c2.8-11.3 8.6-21.5 16.8-29.7l40.3-40.3c-32.1-31-75.7-50.1-123.9-50.1l-91.4 0zm435.5-68.3c-15.6-15.6-40.9-15.6-56.6 0l-29.4 29.4 71 71 29.4-29.4c15.6-15.6 15.6-40.9 0-56.6l-14.4-14.4zM375.9 417c-4.1 4.1-7 9.2-8.4 14.9l-15 60.1c-1.4 5.5 .2 11.2 4.2 15.2s9.7 5.6 15.2 4.2l60.1-15c5.6-1.4 10.8-4.3 14.9-8.4L576.1 358.7l-71-71L375.9 417z"/></svg>
        <div class="mt-2 fw-bold" style="color: #81c2f3">Chỉnh sửa thông tin sinh viên</div>
      </div>
    </div>

   <!-- Chỉnh sửa tài khoản -->
   <div class="col-md-3 ">
      <div class="feature-card text-center" onclick="loadFeature('searchForReaderAccountModal')" data-bs-toggle="modal" data-bs-target="#searchForReaderAccountModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="31" height="31" viewBox="0 0 512 512">
          <path fill="#65dde6" d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zM291.7 90.3L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2c-2.5 8.5.8 17.6 7 23.8s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"/>
        </svg>
        <div class="mt-2 fw-bold" style="color: #65dde6">Chỉnh sửa tài khoản</div>
      </div>
    </div>
   </div>
      </div>
        </div>
          </div>
 <!-- Modal Thêm độc giả -->
 <div class="modal fade" id="addReaderModal" tabindex="-1" aria-labelledby="addReaderLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="addReaderLabel">Thêm sinh viên</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <form id="addReaderForm">
                  <div class="mb-3">
                      <label for="addReader" class="form-label">Họ và tên</label>
                      <input type="text" class="form-control" id="addName"  placeholder="Nhập vào họ tên" required>
                  </div>
                  <div class="mb-3">
                      <label for="addStudentID" class="form-label">Mã số sinh viên</label>
                      <input type="text" class="form-control" id="addStudentID"  placeholder="Nhập vào mã số sinh viên" required>
                  </div>
                  <div class="mb-3">
                      <label for="addEmail" class="form-label">Email</label>
                      <input type="text" class="form-control" id="addEmail" placeholder="Nhập vào email" required>
                  </div>
                    <div class="mb-3">
                        <label for="addPhoneNumber" class="form-label">Số điện thoại</label>
                        <input type="text" class="form-control" id="addPhoneNumber"  placeholder="Nhập vào số điện thoại" required>
                    </div>
                    <div class="mb-3">
                         <label for="addFaculty" class="form-label">Chọn khoa:</label>
                         <select class="form-control" id="addFaculty" name="faculty" required>
                           <option value="" selected>-- Chọn khoa --</option>
                           <option value="Khoa Học Máy Tính">Khoa Học Máy Tính</option>
                           <option value="Tự Động Hóa & Điện Tử">Tự Động Hóa & Điện Tử</option>
                           <option value="Công Nghệ Thông Tin Toàn Cầu">Công Nghệ Thông Tin Toàn Cầu</option>
                           <option value="Kỹ Thuật Phần Mềm">Kỹ Thuật Phần Mềm</option>
                           <option value="Quản Trị Công Nghệ">Quản Trị Công Nghệ</option>
                           <option value="Thiết Kế & Truyền Thông Số">Thiết Kế & Truyền Thông Số</option>
                           <option value="Khoa Học Dữ Liệu & AI">Khoa Học Dữ Liệu & AI</option>
                           <option value="Ngoại Ngữ & Giao Tiếp">Ngoại Ngữ & Giao Tiếp</option>
                           <option value="Công Nghệ Sinh Học & Kỹ Thuật Y Sinh">Công Nghệ Sinh Học & Kỹ Thuật Y Sinh</option>
                         </select>
                       </div>
                  <button type="submit" class="btn btn-success">Submit</button>
              </form>
          </div>
  </div>
</div>
</div>

<!-- Modal Tìm kiếm độc giả -->
<div class="modal fade" id="searchReaderModal" tabindex="-1" aria-labelledby="searchReaderLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="searchReaderLabel">Tìm kiếm sinh viên</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
                <form id="searchReaderForm">
                    <div class="mb-3">
                      <label for="searchReader" class="form-label">Mã số sinh viên </label>
                      <input type="text" class="form-control" id="searchStudentID"  placeholder="Nhập vào mã số sinh viên" required>
                    </div>
                <button type="submit" class="btn btn-warning">Submit</button>
                </form>
          </div>
          <div>
            <p id="resultText" class="ms-4 fw-bold" style="display: none;">Kết quả tìm kiếm</p>
            <p id="readerSearchResults" class="ms-4 fw-bold text-primary" style="display: none;">
            <!-- Kết quả tìm kiếm sẽ được hiển thị ở đây -->
            </p>
          </div>
      </div>
   </div>
</div>

<!-- Modal chỉnh sửa thông tin độc giả -->
 <!-- Nhập thông tin độc giả cần chỉnh sửa ra -->
<div class="modal fade" id="updateStudentModal" tabindex="-1" aria-labelledby="updateReaderLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="updateReaderLabel">Chỉnh sửa thông tin</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
                <form id="updateStudentForm">
                    <div class="mb-3">
                      <label for="updateReader" class="form-label">Mã số sinh viên </label>
                      <input type="text" class="form-control" id="updateStudentID"  placeholder="Nhập vào mã số sinh viên" required>
                    </div>
                <button type="submit" class="btn btn-primary">Submit</button>
                </form>
          </div>
      </div>
   </div>
</div>
<!-- Modal hiện ra để cập nhật thông tin  -->

<div class="modal fade" id="updateReaderAfterModal" tabindex="-1" aria-labelledby="updateReaderAfterLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="updateReaderAfterLabel">Chỉnh sửa thông tin</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
              <form id="updateReaderAfterForm">
                  <div class="mb-3">
                      <label for="updateReaderAfterName" class="form-label">Họ và tên</label>
                      <input type="text" class="form-control" id="updateReaderAfterName"  placeholder="Nhập vào họ tên" required>
                  </div>
                  <div class="mb-3">
                      <label for="updateReaderAfterID" class="form-label">Mã số sinh viên</label>
                      <input type="text" class="form-control" id="updateReaderAfterID"  placeholder="Nhập vào mã số sinh viên" required>
                  </div>
                  <div class="mb-3">
                      <label for="updateReaderAfterEmail" class="form-label">Email</label>
                      <input type="text" class="form-control" id="updateReaderAfterEmail" placeholder="Nhập vào email" required>
                  </div>
                    <div class="mb-3">
                        <label for="updateReaderAfterPhoneNumber" class="form-label">Số điện thoại</label>
                        <input type="text" class="form-control" id="updateReaderAfterPhoneNumber"  placeholder="Nhập vào số điện thoại" required>
                    </div>
                    <div class="mb-3">
                         <label for="addFaculty" class="form-label">Chọn khoa:</label>
                         <select class="form-control" id="updateReaderAfterFaculty" name="faculty" required>
                           <option value="" selected>-- Chọn khoa --</option>
                           <option value="Khoa Học Máy Tính">Khoa Học Máy Tính</option>
                           <option value="Tự Động Hóa & Điện Tử">Tự Động Hóa & Điện Tử</option>
                           <option value="Công Nghệ Thông Tin Toàn Cầu">Công Nghệ Thông Tin Toàn Cầu</option>
                           <option value="Kỹ Thuật Phần Mềm">Kỹ Thuật Phần Mềm</option>
                           <option value="Quản Trị Công Nghệ">Quản Trị Công Nghệ</option>
                           <option value="Thiết Kế & Truyền Thông Số">Thiết Kế & Truyền Thông Số</option>
                           <option value="Khoa Học Dữ Liệu & AI">Khoa Học Dữ Liệu & AI</option>
                           <option value="Ngoại Ngữ & Giao Tiếp">Ngoại Ngữ & Giao Tiếp</option>
                           <option value="Công Nghệ Sinh Học & Kỹ Thuật Y Sinh">Công Nghệ Sinh Học & Kỹ Thuật Y Sinh</option>
                         </select>
                       </div>
                      <div class="mb-3">
                          <label for="updateReaderAfterStatus" class="form-label">Trạng thái</label>
                          <select class="form-control" id="updateReaderAfterStatus" required>
                              <option value="Active">Active</option>
                              <option value="Inactive">Inactive</option>
                              <option value="Banned">Banned</option>
                          </select>
                           </div>
                          <div class="form-check mt-3">
                        <input class="form-check-input" type="checkbox" id="keepAccountStatus">
                        <label class="form-check-label" for="keepAccountStatus">
                            Đồng bộ trạng thái tài khoản
                        </label>
                          </div>
                  <div class="mt-3"><button type="submit" class="btn btn-primary">Submit</button></div>
              </form>
          </div>
  </div>
</div>
</div>

<!-- Modal hiện ra để tạo tài khoản cho độc giả  -->
<div class="modal fade" id="addAccountReaderModal" tabindex="-1" aria-labelledby="addAccountReaderLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title" id="addAccountReaderLabel">Thêm tài khoản sinh viên</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
                <form id="addAccountReaderForm">
                    <div class="mb-3">
                      <input type="text" class="form-control" id="addAccountUserName" placeholder="Nhập vào tên đăng nhập" required>
                    </div>
                    <div class="mb-3">
                      <input type="text" class="form-control" id="addAccountPassword1" placeholder="Nhập vào mật khẩu" required>
                    </div>
                    <div class="mb-3">
                      <input type="text" class="form-control" id="addAccountPassword2" placeholder="Xác nhận lại mật khẩu" required>
                    </div>
                    <button type="submit" class="btn btn-success">Submit</button>
                </form>
          </div>
      </div>
   </div>
</div>

<!-- Chỉnh sửa thông tin tài khoản sinh viên -->
 <!--Tìm kiếm tài khoản sinh viên -->
<div class="modal fade" id="searchForReaderAccountModal" tabindex="-1" aria-labelledby="searchForReaderAccountLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Chỉnh sửa tài khoản sinh viên</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
                <form id="searchForReaderAccountForm">
                <label for="searchForReaderAccount" class="form-label">Mã số sinh viên</label>
                    <div class="mb-3">
                      <input type="text" class="form-control" id="searchForReaderAccountID" placeholder="Nhập vào mã số sinh viên" required>
                    </div>
                    <button type="submit" class="btn" style="background-color: #65dde6;">Submit</button>
                </form>
          </div>
      </div>
   </div>
</div>

<!-- Modal hiện ra để thay đổi thông tin -->
<div class="modal fade" id="changeAccountModal" tabindex="-1" aria-labelledby="searchForReaderAccountLabel" aria-hidden="true">
  <div class="modal-dialog">
      <div class="modal-content">
          <div class="modal-header">
              <h5 class="modal-title">Chỉnh sửa tài khoản sinh viên</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
                <form id="changeAccountForm">
                <label for="changeAccount" class="form-label">Nhập vào mật khẩu mới</label>
                    <div class="mb-3">
                      <input type="text" class="form-control" id="changeAccountPasswordNew1" placeholder="Nhập vào mã số sinh viên" >
                    </div>
                   <label for="changeAccount" class="form-label">Xác nhận lại mật khẩu</label>
                    <div class="mb-3">
                      <input type="text" class="form-control" id="changeAccountPasswordNew2" placeholder="Nhập vào mã số sinh viên" >
                    </div>
                    <div class="mb-3">
                          <label for="changeAccount" class="form-label">Trạng thái</label>
                          <select class="form-control" id="changeAccountStatus" required>
                              <option value="Active">Active</option>
                              <option value="Inactive">Disabled</option>
                              <option value="Banned">Banned</option>
                          </select>
                           </div>
                    <button type="submit" class="btn" style="background-color: #65dde6;">Submit</button>
                </form>
          </div>
      </div>
   </div>
</div>
<!-- File script -->

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="crud-reader-management.js"></script>
  </body>
</html>

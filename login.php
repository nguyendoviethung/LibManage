<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="./assets/css/login.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" />
</head>
<body>
  <body class="login-page">
    <h1 class="login-title">Welcome to Global Connectivity University of Technology</h1>
    <div class="login-form">
      <form id="login-form">
        <h3 class="text-center mb-4">Login</h3>
        <div class="input-wrapper">
          <input type="text" id="username" placeholder="Enter your username" required>
          <i class="bi bi-person icon-right"></i>
        </div>
        <div class="input-wrapper">
          <input type="password" id="password" placeholder="Enter your password" required>
          <i class="bi bi-lock icon-right"></i>
        </div>
        <button type="submit" class="login-btn">Đăng nhập</button>
      </form>
      <div class="text-center mt-3">
        <a href="#" class="forgot-password">Forgot password?</a>      
    </div>
</body>
<!-- JS -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="./assets/js/login-handler.js"></script>
</body>
</html>
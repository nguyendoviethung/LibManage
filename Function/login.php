
<?php
session_start();

// Nếu đã đăng nhập, chuyển hướng đến admin.php
if (isset($_SESSION['username'])) {
    header('Location: admin.php');
    exit();
}

// Kiểm tra nếu form đã được gửi
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (!empty($_POST['Username']) && !empty($_POST['Password'])) {
        $username = $_POST['Username'];
        $password = $_POST['Password'];

        // Thông tin đăng nhập mẫu (có thể thay bằng CSDL)
        $admin_user = 'admin';
        $admin_pass = '21072004';

        if ($username == $admin_user && $password == $admin_pass) {
            $_SESSION['username'] = $username; // Lưu session
            header('Location: admin.php'); // Chuyển hướng đến trang admin
            exit();
        } else {
            $_SESSION['error'] = "⚠ Sai tài khoản hoặc mật khẩu. Vui lòng thử lại!";
            header('Location: ../Assets/HTML/login.html'); // Quay lại trang đăng nhập
            exit();
        }
    } else {
        $_SESSION['error'] = "⚠ Vui lòng nhập đầy đủ Username và Password!";
        header('Location: ../Assets/HTML/login.html');
        exit();
    }
}
?>

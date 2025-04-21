document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form
  
    let loginUsername = document.getElementById("username").value.trim();
    let loginPassword = document.getElementById("password").value.trim();
  
    fetch(".../../api/auth/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        loginUsername : loginUsername,
        loginPassword : loginPassword 
    })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        //  Đăng nhập thành công → chuyển hướng
        window.location.href = data.redirect_url;
      } else {
        alert(data.message); // Sai tài khoản hoặc lỗi
      }
    });
  });
  
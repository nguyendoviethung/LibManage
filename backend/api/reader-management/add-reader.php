<?php
require __DIR__ . '/../../middleware/auth-middleware.php';
require __DIR__ .'/../../helpers/validation.php';
require __DIR__ .'/../../vendor/autoload.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
checkAdminRole($decode);

$mail = new PHPMailer(true);

try {
$name = $data['full_name'] ?? '';
$studentID = $data['student_id'] ?? '';
$email = $data['email'] ?? '';
$phoneNumber = $data['phone_number'] ?? '';
$faculty = $data['faculty'] ?? '';

// --- Validate dữ liệu ---
if (isValidStudentID($studentID) == false) {
    echo json_encode(['success' => false, 'message' => 'Mã số sinh viên không hợp lệ.']);
    exit;
} else if (isValidSchoolEmail($email, $name, $studentID) == false) {
    echo json_encode(['success' => false, 'message' => 'Email không hợp lệ.']);
    exit;
} else if (isValidPhoneNumber($phoneNumber) == false) {
    echo json_encode(['success' => false, 'message' => 'Số điện thoại không hợp lệ.']);
    exit;
} else if (isValidFaculty($faculty) == false) {
    echo json_encode(['success' => false, 'message' => 'Tên khoa không hợp lệ.']);
    exit;
} else {
    // 1. Kiểm tra xem mã số sinh viên đã tồn tại chưa
    $checkQuery = "SELECT 1 FROM reader WHERE student_id = :student_id";
    $stmt = $pdo->prepare($checkQuery);
    $stmt->execute(['student_id' => $studentID]);

    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => 'Mã số sinh viên này đã tồn tại']);
        exit;
    }

    // 2. Kiểm tra số điện thoại đã tồn tại chưa
    $checkPhoneQuery = "SELECT 1 FROM reader WHERE phone_number = :phone_number";
    $stmt = $pdo->prepare($checkPhoneQuery);
    $stmt->execute(['phone_number' => $phoneNumber]);

    if ($stmt->fetch()) {
        echo json_encode(['success' => false, 'message' => '❗ Số điện thoại này đã được sử dụng.']);
        exit;
    }

    // 3. Thêm sinh viên mới vào CSDL
    $insertQuery = "INSERT INTO reader (student_id, full_name, email, phone_number, faculty)
                    VALUES (:student_id, :full_name, :email, :phone_number, :faculty)";
    $stmt = $pdo->prepare($insertQuery);

    $success_1 = $stmt->execute([
        'student_id'   => $studentID,
        'full_name'    => $name,
        'email'        => $email,
        'phone_number' => $phoneNumber,
        'faculty'      => $faculty
    ]);

    //4. Tạo tài khoản cho sinh viên đó 
    $username = $email;
    $password = bin2hex(random_bytes(4)); // 8 ký tự hex
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $insertAccountQuery = "INSERT INTO readeraccounts (student_id, username, password, status)
    VALUES (:student_id, :username, :password, :status)";
    $stmt = $pdo->prepare($insertAccountQuery);

    $success_2 = $stmt->execute([
        'student_id' => $studentID,
        'username' => $username,
        'password' => $hashedPassword,
        'status' => 'Active'
    ]);
    
    //5. Username và password về mail của sinh viên tương ứng
    $mail->isSMTP();
    $mail->Host       = 'localhost';   // Kết nối MailHog/Mailpit
    $mail->Port       = 1025;          // Port SMTP mặc định
    $mail->SMTPAuth   = false;         // Không cần auth local
    $mail->SMTPSecure = false;         // Không cần TLS/SSL

    // Người gửi & người nhận
    $mail->setFrom('admin@libmanage.com', 'Library System GCUT');
    $mail->addAddress($email, $name);

    // Nội dung mail
    $mail->isHTML(true);
    $mail->Subject = "Tài khoản thư viện của bạn";
    $mail->Body    = "
        Xin chào <b>$name</b>,<br>
        Tài khoản của bạn đã được tạo:<br>
        Username: <b>$username</b><br>
        Password: <b>$password</b><br>
        <i>Vui lòng đổi mật khẩu sau khi đăng nhập.</i>
    ";

    $mail->AltBody = "Xin chào $name, \n
        Tài khoản của bạn đã được tạo: \n
        Username: $username \n
        Password: $password \n
        Vui lòng đổi mật khẩu sau khi đăng nhập.";
        
    }
  if ($success_1 && $success_2) {
    try {
        $mail->send();
        echo json_encode(['success' => true, 'message' => 'Thêm thành công và mail đã gửi']);
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Thêm thành công nhưng mail lỗi: ' . $mail->ErrorInfo]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Có lỗi khi thêm sinh viên.']);
}

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Lỗi DB: " . $e->getMessage()
    ]);
    exit;
}
?>

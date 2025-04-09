<?php
// Hàm kiểm tra định dạng mã số sinh viên
function isValidStudentID($studentID) {
    if (!preg_match('/^\d{8}$/', $studentID)) return false;

    $year = substr($studentID, 0, 4);
    $sequence = substr($studentID, 4, 4);

    // Kiểm tra năm hợp lệ (ví dụ từ 2010 đến năm hiện tại + 1)
    $currentYear = date("Y") + 1;
    if ((int)$year < 2010 || (int)$year > $currentYear) return false;

    // Số thứ tự phải >= 0001 và <= 9999
    if ((int)$sequence < 1 || (int)$sequence > 9999) return false;

    return true;
}
// Ham kiểm tra định dạng email
function isValidSchoolEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) && str_ends_with($email, '@stu.gcut.edu.vn');
}

// Hàm kiểm tra định dạng số điện thoại

function isValidPhoneNumber($phone) {
    // Loại bỏ khoảng trắng, dấu - hoặc dấu .
    $phone = preg_replace('/[\s\-.]/', '', $phone);

    // Kiểm tra bắt đầu bằng 0 hoặc +84, theo sau là 9–10 chữ số
    return preg_match('/^(0|\+84)[0-9]{9}$/', $phone);
}

// Hàm kiểm tra định dạng tên khoa 

function isValidFaculty($facultyName) {
    $validFaculties = [
        'Khoa Khoa Học Máy Tính',
        'Khoa Tự Động Hóa & Điện Tử',
        'Khoa Công Nghệ Thông Tin Toàn Cầu',
        'Khoa Kỹ Thuật Phần Mềm',
        'Khoa Quản Trị Công Nghệ',
        'Khoa Thiết Kế & Truyền Thông Số',
        'Khoa Khoa Học Dữ Liệu & AI',
        'Khoa Ngoại Ngữ & Giao Tiếp',
        'Khoa Công Nghệ Sinh Học & Kỹ Thuật Y Sinh'
    ];

    // Chỉ kiểm tra xem chuỗi nhập vào có nằm trong danh sách không (phân biệt hoa thường)
    return in_array($facultyName, $validFaculties);
}
include '../Auth/connect.php'; // Kết nối đến cơ sở dữ liệu
if (!$conn) {
    echo json_encode(["error" => "Không thể kết nối cơ sở dữ liệu."]);
    exit;
}

// Đọc dữ liệu JSON từ client
$data = json_decode(file_get_contents('php://input'), true);
$name = $data['name'] ?? ''; //Gán biến $name bằng $data['name'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.
$studentID = $data['studentID'] ?? ''; //Gán biến $studentID bằng $data['studentID'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.
$email = $data['email'] ?? ''; //Gán biến $email bằng $data['email'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.
$phoneNumber= $data['phoneNumber'] ?? ''; //Gán biến $phone bằng $data['phone'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.
$faculty = $data['faculty'] ?? ''; //Gán biến $faculty bằng $data['faculty'] nếu có, nếu không có (không tồn tại hoặc null) thì gán bằng chuỗi rỗng ''.


?>
